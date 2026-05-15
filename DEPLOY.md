# 智墒巡田 - 公网部署指南

## 🏗 架构设计

```
                        ┌─────────────────┐
                        │     用户端       │
                        │  微信小程序/Web   │
                        └────────┬────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                         公网服务器                                │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    │
│  │   Nginx      │───▶│   Backend    │───▶│   MongoDB     │    │
│  │  (端口 80/443) │    │  (端口 3001) │    │  (端口 27017) │    │
│  └──────────────┘    └──────────────┘    └──────────────┘    │
│         │                   │                                   │
│         │            ┌──────┴──────┐                           │
│         │            │  DeepSeek   │                           │
│         │            │   API       │                           │
│         │            └─────────────┘                           │
└─────────┼───────────────────────────────────────────────────────┘
          │
          ▼
   ┌──────────────┐
   │   前端静态资源 │
   │   (由Nginx托管) │
   └──────────────┘
```

## 🔐 安全原则

1. **敏感数据不上传服务器** - API Key 只存在于后端环境变量
2. **数据库需要认证** - 不要使用无密码的 MongoDB
3. **前后端通信使用 HTTPS** - 生产环境必须配置 SSL
4. **Nginx 反向代理** - 隐藏真实后端端口

---

## 📦 服务器准备

### 推荐配置

| 服务 | 配置 | 说明 |
|------|------|------|
| 云服务器 | 2核4G | 腾讯云/阿里云/华为云 |
| MongoDB | 1核2G | 可使用云数据库服务 |
| 系统 | Ubuntu 22.04 | 或 CentOS 8+ |

### 安装必要软件

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 安装 Nginx
sudo apt install -y nginx

# 安装 PM2 (进程管理)
sudo npm install -g pm2
```

---

## 🚀 部署步骤

### 1. 上传代码到服务器

```bash
# 在本地项目目录打包
zip -r smart-farm.zip backend frontend miniprogram README.md package.json .env.example .gitignore

# 上传到服务器
scp smart-farm.zip user@your-server:/home/ubuntu/

# 在服务器解压
ssh user@your-server
unzip smart-farm.zip
cd 四足机器人
```

### 2. 配置后端

```bash
cd backend

# 创建环境变量文件
cp ../.env.example .env

# 编辑配置
nano .env
```

```env
# 生产环境配置
PORT=3001
MONGODB_URI=mongodb://your-mongodb-host:27017/smart_farm
DEEPSEEK_API_KEY=你的DeepSeek_API密钥          # 🔴 关键：填入你的API密钥
DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions
NODE_ENV=production
```

```bash
# 安装依赖
npm install

# 使用 PM2 启动后端
pm2 start npm --name "smart-farm-backend" -- start
pm2 save
pm2 startup
```

### 3. 配置前端

修改前端 API 地址：

```bash
cd ../frontend

# 编辑 API 配置文件（如果有单独的配置文件）
# 或修改 src 目录下的 API 调用地址
```

### 4. 配置 Nginx

```bash
sudo nano /etc/nginx/sites-available/smart-farm
```

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 你的域名或IP

    # 前端静态文件
    location / {
        root /var/www/smart-farm/frontend/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # 后端 API 代理
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 阻止访问敏感文件
    location ~ /\. {
        deny all;
    }
}
```

```bash
# 启用站点
sudo ln -s /etc/nginx/sites-available/smart-farm /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. 配置 HTTPS（推荐）

```bash
# 安装 Certbot
sudo apt install -y certbot python3-certbot-nginx

# 获取 SSL 证书
sudo certbot --nginx -d your-domain.com
```

### 6. 微信小程序配置

在小程序 `app.js` 中修改 API 地址：

```javascript
globalData: {
  apiUrl: 'https://your-domain.com/api',  // 使用 HTTPS
  userInfo: null
}
```

在微信公众平台后台配置：
- 开发管理 → 开发设置 → 服务器域名
- 添加 request 合法域名：`https://your-domain.com`

---

## 🛡 安全检查清单

### 🔴 必须完成的配置

- [ ] MongoDB 设置强密码
- [ ] `.env` 文件不包含真实密钥在代码中
- [ ] 服务器防火墙只开放 80/443 端口
- [ ] 后端 API 不暴露不必要的路由

### 🟡 建议完成的配置

- [ ] 配置 HTTPS (Let's Encrypt 免费)
- [ ] 使用 PM2 管理后端进程
- [ ] 配置 Nginx 日志
- [ ] 启用防火墙 (ufw)

---

## 📊 常用运维命令

```bash
# 查看后端状态
pm2 status

# 查看后端日志
pm2 logs smart-farm-backend

# 重启后端
pm2 restart smart-farm-backend

# 重载 Nginx
sudo nginx -s reload

# 查看 Nginx 状态
sudo systemctl status nginx

# 查看端口占用
sudo netstat -tlnp | grep -E '80|443|3001'
```

---

## 🐳 可选：Docker 部署

如果你熟悉 Docker，可以使用以下方式部署：

### docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/smart_farm
      - DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY}
    depends_on:
      - mongo

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

> ⚠️ 注意：使用 Docker 部署时，API Key 应该通过环境变量传入，不要写在 docker-compose.yml 中

---

## 🔧 常见问题

### Q: MongoDB 连接失败
A: 检查 MongoDB 是否开启认证，确认 `MONGODB_URI` 格式正确

### Q: API 调用超时
A: 检查防火墙是否开放 3001 端口，确认 DeepSeek API Key 有效

### Q: 微信小程序无法请求
A: 确保已在微信公众平台配置 request 合法域名

---

## 📞 获取帮助

如部署遇到问题，请提供：
1. 错误日志
2. 服务器系统版本
3. 使用的云服务商