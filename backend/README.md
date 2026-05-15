# 智墒巡田 后端 API 服务

四足机器人田间智能感知系统的后端 API 服务。

## 🚀 快速开始

### 1. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，填入真实配置
```

### 2. .env 配置说明

```env
# 服务端口
PORT=3001

# MongoDB 数据库连接
MONGODB_URI=mongodb://localhost:27017/smart_farm

# DeepSeek AI API 密钥（必填）
DEEPSEEK_API_KEY=你的DeepSeek_API密钥

# DeepSeek API 地址（一般不需要修改）
DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions

# 运行环境
NODE_ENV=development
```

### 3. 安装并启动

```bash
# 安装依赖
npm install

# 开发环境启动（热更新）
npm run dev

# 生产环境启动
npm start
```

服务启动后访问：`http://localhost:3001`

## 📁 项目结构

```
src/
├── config/
│   └── database.ts      # MongoDB 连接配置
├── models/
│   ├── SoilData.ts      # 土壤数据模型
│   ├── CropData.ts      # 作物数据模型
│   ├── WeatherData.ts   # 天气数据模型
│   └── LocationData.ts   # 位置数据模型
├── routes/
│   ├── auth.ts          # 认证接口
│   ├── soilData.ts      # 土壤数据接口
│   ├── cropData.ts      # 作物数据接口
│   ├── weatherData.ts   # 天气数据接口
│   ├── locationData.ts  # 位置数据接口
│   ├── analysis.ts      # 数据分析接口
│   └── ai.ts            # AI 分析接口
└── server.ts            # 服务器入口
```

## 🛠 技术栈

- Node.js
- Express.js
- MongoDB + Mongoose
- TypeScript
- DeepSeek API

## 📡 API 接口列表

### 认证接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `POST /api/auth/login` | POST | 用户登录 |
| `POST /api/auth/logout` | POST | 用户登出 |

### 数据接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `GET /api/soil` | GET | 获取所有土壤数据 |
| `POST /api/soil` | POST | 添加土壤数据 |
| `DELETE /api/soil/:id` | DELETE | 删除土壤数据 |
| `GET /api/crop` | GET | 获取所有作物数据 |
| `POST /api/crop` | POST | 添加作物数据 |
| `DELETE /api/crop/:id` | DELETE | 删除作物数据 |
| `GET /api/weather` | GET | 获取天气数据 |
| `POST /api/weather` | POST | 添加天气数据 |
| `GET /api/location` | GET | 获取位置数据 |
| `POST /api/location` | POST | 添加位置数据 |

### 分析接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `GET /api/analysis/statistics` | GET | 获取数据统计 |
| `GET /api/analysis/drought-warning` | GET | 干旱预警 |
| `GET /api/analysis/crop-health` | GET | 作物健康分析 |

### AI 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `POST /api/ai/drought-analysis` | POST | 干旱分析 |
| `POST /api/ai/crop-prediction` | POST | 作物产量预测 |
| `POST /api/ai/analyze` | POST | 自定义分析 |

## 🔐 安全说明

### ⚠️ 重要：保护你的 API Key

- **不要**将真实的 `.env` 文件上传到 GitHub
- `.env.example` 文件仅包含示例格式，不包含真实密钥
- 生产环境务必使用强密码的 MongoDB

### 生产环境建议

1. 使用环境变量而非 `.env` 文件
2. 启用 MongoDB 认证
3. 配置 HTTPS
4. 使用 PM2 管理进程

## 🐛 常见问题

### Q: MongoDB 连接失败
A: 检查：
1. MongoDB 服务是否启动
2. `MONGODB_URI` 格式是否正确
3. 是否启用了认证（如果是远程数据库）

### Q: AI 接口调用失败
A: 检查：
1. `DEEPSEEK_API_KEY` 是否正确
2. API 额度是否充足
3. 网络连接是否正常

### Q: 端口被占用
A: 修改 `.env` 中的 `PORT` 值，或停止占用端口的进程

## 📊 部署到生产环境

```bash
# 安装 PM2
npm install -g pm2

# 使用 PM2 启动
pm2 start npm --name "smart-farm" -- start

# 保存进程列表
pm2 save

# 设置开机自启
pm2 startup
```

## 📄 许可证

MIT