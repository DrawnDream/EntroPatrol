# 项目分离指南

## 📦 分离后的结构

```
四足机器人项目（总项目）
│
├── 📂 smart-farm-web/          # Web前端（React）
│   ├── README.md
│   ├── package.json
│   └── src/
│
├── 📂 smart-farm-miniprogram/  # 微信小程序
│   ├── README.md
│   ├── app.js
│   └── pages/
│
├── 📂 smart-farm-backend/       # 后端API
│   ├── README.md
│   ├── package.json
│   └── src/
│
└── 📄 SHARING_GUIDE.md         # 本文件 - 分享指南
```

---

## 🚀 快速分离操作

### 方法一：文件夹分离（推荐）

在桌面创建三个新文件夹，手动复制对应代码：

```
Desktop/
├── smart-farm-web/      ← 复制 frontend/ 中的所有文件
├── smart-farm-miniprogram/ ← 复制 miniprogram/ 中的所有文件
└── smart-farm-backend/ ← 复制 backend/ 中的所有文件
```

### 方法二：使用 Git Submodules

建议将三个部分作为独立的 Git 仓库管理。

---

## 📱 分离后的项目

### 1. smart-farm-web（Web前端）

**技术栈：** React + TypeScript + Recharts

**独立功能：**
- 数据仪表盘
- 土壤/作物/天气数据管理
- AI分析界面
- 机器人位置地图

**部署方式：**
```bash
cd smart-farm-web
npm install
npm start        # 开发环境
npm run build    # 生产环境构建
```

**部署后：**
- 构建产物在 `build/` 目录
- 使用 Nginx 托管静态文件
- API 请求通过 `/api` 代理到后端

---

### 2. smart-farm-miniprogram（微信小程序）

**技术栈：** 原生小程序 + WXML/WXSS/JS

**独立功能：**
- 数据概览
- 土壤/作物数据查看
- AI智能助手
- 个人中心

**部署方式：**
1. 用微信开发者工具打开 `smart-farm-miniprogram` 目录
2. 修改 `app.js` 中的 `apiUrl` 为实际后端地址
3. 修改 `utils/api.js` 中的 `BASE_URL` 为实际后端地址
4. 上传到微信公众平台

**重要配置：**
```javascript
// app.js
globalData: {
  apiUrl: 'https://你的域名.com/api'  // ← 手动修改
}
```

```javascript
// utils/api.js
const BASE_URL = 'https://你的域名.com/api';  // ← 手动修改
```

---

### 3. smart-farm-backend（后端API）

**技术栈：** Node.js + Express + MongoDB + TypeScript

**独立功能：**
- RESTful API 服务
- 数据库操作
- AI 大模型集成
- 用户认证

**部署方式：**
```bash
cd smart-farm-backend
npm install
npm run dev      # 开发环境
npm start        # 生产环境
```

**环境配置：**
```bash
cp .env.example .env
# 编辑 .env，填入真实配置
```

**.env 配置示例：**
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/smart_farm
DEEPSEEK_API_KEY=你的真实API密钥
DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions
NODE_ENV=production
```

---

## 🔐 隐私保护对照表

| 数据 | web | miniprogram | backend | 说明 |
|------|-----|-------------|---------|------|
| DeepSeek API Key | ❌ | ❌ | ✅ | 仅后端需要 |
| MongoDB URI | ❌ | ❌ | ✅ | 仅后端需要 |
| API 地址 | ✅ | ✅ | ❌ | 前端和小程序需要 |
| 用户密码 | ❌ | ❌ | ✅ | 仅后端验证 |

---

## 🌐 公网部署架构

```
                        ┌──────────────┐
                        │   用户浏览器   │
                        └──────┬───────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
              ┌─────▼─────┐        ┌─────▼─────┐
              │  小程序    │        │  Web前端   │
              └─────┬─────┘        └─────┬─────┘
                    │                     │
                    └─────────┬───────────┘
                              │
                    ┌─────────▼─────────┐
                    │      Nginx        │
                    │   (反向代理 :80)   │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │    Backend API    │
                    │    (:3001)        │
                    └─────────┬─────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
        ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐
        │  MongoDB  │   │ DeepSeek  │   │   其他    │
        │  数据库   │   │   API     │   │  服务    │
        └───────────┘   └───────────┘   └───────────┘
```

---

## 📋 分离后的文件清单

### smart-farm-web/
```
smart-farm-web/
├── public/
│   └── images/
├── src/
│   ├── components/
│   ├── App.tsx
│   ├── App.css
│   └── index.tsx
├── package.json
├── tsconfig.json
└── README.md
```

### smart-farm-miniprogram/
```
smart-farm-miniprogram/
├── images/
├── pages/
│   ├── ai/
│   ├── analysis/
│   ├── crop/
│   ├── index/
│   ├── login/
│   ├── profile/
│   └── soil/
├── scripts/
├── utils/
├── app.js
├── app.json
├── app.wxss
├── project.config.json
└── README.md
```

### smart-farm-backend/
```
smart-farm-backend/
├── src/
│   ├── config/
│   ├── models/
│   ├── routes/
│   └── server.ts
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

## ✅ 分享给别人的步骤

### 1. 准备三个独立压缩包

```
smart-farm-web.zip      ← 包含 web 项目所有文件
smart-farm-miniprogram.zip ← 包含小程序所有文件
smart-farm-backend.zip ← 包含后端所有文件（不含真实 .env）
```

### 2. 为每个项目准备说明

**smart-farm-web/README.md：**
```markdown
# 智墒巡田 Web 管理平台

## 快速开始
npm install
npm start

## 生产环境部署
npm run build
# 将 build/ 目录部署到 Nginx
```

**smart-farm-miniprogram/README.md：**
```markdown
# 智墒巡田 小程序

## 配置
1. 打开 miniprogram/app.js
2. 修改 apiUrl 为你的后端地址
3. 打开 utils/api.js
4. 修改 BASE_URL 为你的后端地址

## 使用
1. 用微信开发者工具打开项目
2. 填入后端 API 地址
3. 编译运行
```

**smart-farm-backend/README.md：**
```markdown
# 智墒巡田 后端服务

## 配置
cp .env.example .env
# 填入 MONGODB_URI 和 DEEPSEEK_API_KEY

## 启动
npm install
npm start
```

---

## 🔧 常用运维命令

### 后端
```bash
# 启动
pm2 start npm --name "backend" -- start

# 查看状态
pm2 status

# 查看日志
pm2 logs backend

# 重启
pm2 restart backend
```

### 前端构建
```bash
cd smart-farm-web
npm run build
# 部署 build/ 目录到 Nginx
```

### Nginx 配置示例
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /var/www/smart-farm-web/build;
        index index.html;
    }

    # API 反向代理
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

---

## 📞 需要帮助？

如果分离过程中遇到问题，请检查：
1. 是否遗漏了某些文件
2. 配置文件中的路径是否正确
3. 依赖是否安装完整