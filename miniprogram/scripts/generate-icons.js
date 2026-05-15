const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '../images');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

function crc32(data) {
  let crc = 0xFFFFFFFF;
  const table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c;
  }
  for (let i = 0; i < data.length; i++) {
    crc = table[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const typeBuffer = Buffer.from(type);
  const crcData = Buffer.concat([typeBuffer, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcData));
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function createPNGWithShape(width, height, r, g, b, shape) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const rawData = [];
  for (let y = 0; y < height; y++) {
    rawData.push(0);
    for (let x = 0; x < width; x++) {
      let pixelR = 255, pixelG = 255, pixelB = 255, pixelA = 0;
      
      if (shape === 'circle') {
        const cx = width / 2, cy = height / 2, radius = width / 3;
        const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
        if (dist <= radius) {
          pixelR = r; pixelG = g; pixelB = b; pixelA = 255;
        }
      } else if (shape === 'square') {
        const margin = width / 4;
        if (x >= margin && x < width - margin && y >= margin && y < height - margin) {
          pixelR = r; pixelG = g; pixelB = b; pixelA = 255;
        }
      } else if (shape === 'user') {
        const cx = width / 2, cy = height / 3;
        const headRadius = width / 5;
        const bodyTop = cy + headRadius;
        const bodyHeight = height / 2;
        
        const headDist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
        if (headDist <= headRadius) {
          pixelR = r; pixelG = g; pixelB = b; pixelA = 255;
        }
        if (y >= bodyTop && y < bodyTop + bodyHeight && Math.abs(x - cx) <= width / 4) {
          pixelR = r; pixelG = g; pixelB = b; pixelA = 255;
        }
      } else if (shape === 'chart') {
        const barWidth = width / 6;
        const gap = width / 10;
        const bars = [0.3, 0.7, 0.5, 0.9, 0.6];
        
        for (let i = 0; i < bars.length; i++) {
          const barX = gap + i * (barWidth + gap);
          const barHeight = bars[i] * height * 0.7;
          const barY = height - barHeight;
          
          if (x >= barX && x < barX + barWidth && y >= barY && y < height) {
            pixelR = r; pixelG = g; pixelB = b; pixelA = 255;
          }
        }
      } else if (shape === 'leaf') {
        const cx = width / 2, cy = height / 2;
        for (let ang = 0; ang < Math.PI; ang += 0.05) {
          const r1 = 8 + Math.sin(ang * 3) * 3;
          const px = cx + Math.cos(ang) * r1;
          const py = cy - Math.sin(ang) * r1 * 1.5;
          if (Math.abs(x - px) < 1.5 && Math.abs(y - py) < 1.5) {
            pixelR = r; pixelG = g; pixelB = b; pixelA = 255;
          }
        }
        for (let i = cy - 15; i < cy + 15; i++) {
          if (Math.abs(x - cx) < 1 && i >= 0 && i < height) {
            pixelR = r; pixelG = g; pixelB = b; pixelA = 255;
          }
        }
      } else if (shape === 'brain') {
        const cx = width / 2, cy = height / 2;
        for (let i = 0; i < 5; i++) {
          const bx = cx - 8 + i * 4;
          const by = cy - 5 + Math.sin(i) * 3;
          const br = 4 + Math.cos(i * 1.5) * 2;
          for (let dy = -br; dy <= br; dy++) {
            for (let dx = -br; dx <= br; dx++) {
              if (dx * dx + dy * dy <= br * br) {
                const px = bx + dx;
                const py = by + dy;
                if (px >= 0 && px < width && py >= 0 && py < height) {
                  if (Math.abs(x - px) < 1 && Math.abs(y - py) < 1) {
                    pixelR = r; pixelG = g; pixelB = b; pixelA = 255;
                  }
                }
              }
            }
          }
        }
      } else {
        pixelR = r; pixelG = g; pixelB = b; pixelA = 255;
      }
      
      rawData.push(pixelR, pixelG, pixelB, pixelA);
    }
  }

  const { deflateSync } = require('zlib');
  const compressed = deflateSync(Buffer.from(rawData));

  return Buffer.concat([
    signature,
    createChunk('IHDR', ihdr),
    createChunk('IDAT', compressed),
    createChunk('IEND', Buffer.alloc(0))
  ]);
}

const icons = [
  { name: 'dashboard', color: [107, 114, 128], shape: 'chart' },
  { name: 'dashboard-active', color: [46, 125, 50], shape: 'chart' },
  { name: 'soil', color: [107, 114, 128], shape: 'circle' },
  { name: 'soil-active', color: [46, 125, 50], shape: 'circle' },
  { name: 'crop', color: [107, 114, 128], shape: 'leaf' },
  { name: 'crop-active', color: [46, 125, 50], shape: 'leaf' },
  { name: 'ai', color: [107, 114, 128], shape: 'brain' },
  { name: 'ai-active', color: [46, 125, 50], shape: 'brain' },
  { name: 'user', color: [107, 114, 128], shape: 'user' },
  { name: 'user-active', color: [46, 125, 50], shape: 'user' },
];

icons.forEach(icon => {
  const png = createPNGWithShape(48, 48, ...icon.color, icon.shape);
  fs.writeFileSync(path.join(iconsDir, `${icon.name}.png`), png);
  console.log(`Created ${icon.name}.png (${png.length} bytes)`);
});

console.log('All icons generated successfully!');