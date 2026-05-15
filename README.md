# 智墒巡田 - 四足机器人田间智能感知系统

<div align="center">

**Web管理平台** | **微信小程序** | **后端API服务**

</div>

---

## 📦 项目组成

本项目分为三个独立部分，可单独部署和使用：

| 项目 | 目录 | 技术栈 | 说明 |
|------|------|--------|------|
| **Web 前端** | `frontend/` | React + TypeScript | 数据可视化、管理界面 |
| **微信小程序** | `miniprogram/` | 原生小程序 | 移动端数据查看 |
| **后端服务** | `backend/` | Node.js + Express | API 服务、数据存储、AI 分析 |

---

## 🚀 快速开始

### 1. 启动后端

```bash
cd backend
npm install
cp .env.example .env  # 编辑 .env 填入配置
npm run dev
```

### 2. 启动 Web 前端

```bash
cd frontend
npm install
npm start
```

### 3. 使用微信小程序

```bash
# 用微信开发者工具打开 miniprogram 目录
# 修改 app.js 中的 apiUrl 为后端地址
# 编译运行
```

详细说明请查看各目录下的 README.md

---

## 🔑 必要配置

### 后端 (`backend/.env`)

```env
MONGODB_URI=mongodb://localhost:27017/smart_farm
DEEPSEEK_API_KEY=你的API密钥    # ← 必填
```

### 小程序 (`miniprogram/app.js`)

```javascript
apiUrl: 'http://localhost:3001/api'  // ← 修改为实际地址
```

---

## 🛡 隐私保护

| 数据类型 | 保护方式 |
|----------|----------|
| DeepSeek API Key | 仅存储在后端 `.env`，不上传 |
| MongoDB 密码 | 仅存储在后端 `.env`，不上传 |
| 用户密码 | 后端加密存储，不明文传输 |

**`.gitignore` 已配置**，确保以下文件不上传：
- `node_modules/`
- `*.env`
- `build/`、`.env.example` 等

---

## 📁 目录结构

```
四足机器人/
├── frontend/           # Web 前端（React）
│   ├── README.md
│   ├── package.json
│   └── src/
│
├── miniprogram/        # 微信小程序
│   ├── README.md
│   ├── app.js
│   └── pages/
│
├── backend/            # 后端 API
│   ├── README.md
│   ├── package.json
│   └── src/
│
├── README.md           # 本文件
├── DEPLOY.md           # 公网部署指南
├── GITHUB_PREPARE.md   # GitHub 上传指南
└── PROJECT_SPLIT_GUIDE.md # 项目分离指南
```

---

## 📖 更多文档

- [DEPLOY.md](DEPLOY.md) - 公网部署详细指南
- [GITHUB_PREPARE.md](GITHUB_PREPARE.md) - 上传 GitHub 前的准备
- [PROJECT_SPLIT_GUIDE.md](PROJECT_SPLIT_GUIDE.md) - 项目分离指南

---

## 📄 许可证

MIT