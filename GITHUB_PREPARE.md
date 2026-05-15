# 项目整理报告 - 上传 GitHub 前必读

## ✅ 当前项目状态检查

### 🔴 需要修改的文件（会泄露隐私）

| 文件 | 问题 | 修改方式 |
|------|------|----------|
| `backend/.env` | 包含 DeepSeek API Key 模板 | ✅ 已修改为占位符 |
| `miniprogram/app.js` | API 地址设为 localhost | ⚠️ 需手动配置 |
| `miniprogram/utils/api.js` | API 地址设为 localhost | ⚠️ 需手动配置 |

### 🟡 建议修改的文件

| 文件 | 建议 |
|------|------|
| `backend/src/routes/auth.ts` | 默认测试账号 `123/123` 建议修改 |
| `README.md` | 可选择性删除截图中的敏感信息 |

---

## 📁 上传 GitHub 前的操作清单

### 1. 确认 .gitignore 已包含以下内容

```gitignore
# 环境变量（包含所有敏感配置）
.env
.env.*
*.env

# 依赖目录
node_modules/
*/node_modules/

# 构建输出
build/
dist/

# IDE
.idea/
.vscode/

# 系统文件
.DS_Store
Thumbs.db

# 日志
*.log
```

### 2. 本地需要手动创建/修改的配置

#### 2.1 后端配置 `backend/.env`

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/smart_farm
DEEPSEEK_API_KEY=这里填入你的真实API密钥
DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions
```

#### 2.2 小程序配置 `miniprogram/app.js`

```javascript
globalData: {
  apiUrl: 'https://你的域名.com/api',  // 部署后修改
  userInfo: null
}
```

#### 2.3 小程序 API 配置 `miniprogram/utils/api.js`

```javascript
const BASE_URL = 'https://你的域名.com/api';  // 部署后修改
```

#### 2.4 前端开发代理 `frontend/package.json`

```json
"proxy": "http://localhost:3001"  // 开发环境指向本地后端
```

---

## 🏗 前后端分离架构

```
┌─────────────────────────────────────────────────────────┐
│                     GitHub 仓库                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │  backend/   │  │  frontend/  │  │ miniprogram │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────────────────────────────────────────┘
          │                │                │
          ▼                ▼                ▼
┌─────────────────────────────────────────────────────────┐
│                     生产服务器                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │ Backend  │  │  Nginx   │  │ Database  │            │
│  │ :3001    │  │ :80/:443  │  │ :27017    │            │
│  └──────────┘  └──────────┘  └──────────┘            │
└─────────────────────────────────────────────────────────┘
```

### 各部分说明

| 模块 | 上传 GitHub | 部署时需要 |
|------|------------|-----------|
| `backend/` | ✅ 包含所有代码 | ❌ 需要 `.env` 配置 |
| `frontend/` | ✅ 包含所有代码 | ⚠️ 需要构建 `build/` |
| `miniprogram/` | ✅ 包含所有代码 | ⚠️ 需要改 API 地址 |

---

## 🔐 隐私数据分类

### 不上传的敏感数据（通过 .env 配置）

| 数据 | 说明 | 处理方式 |
|------|------|----------|
| DeepSeek API Key | 大模型调用凭证 | 手动填入服务器 `.env` |
| MongoDB 连接字符串 | 数据库地址和密码 | 手动填入服务器 `.env` |

### 可上传的占位符

| 占位符 | 位置 | 说明 |
|--------|------|------|
| `your_deepseek_api_key_here` | `.env` | 提示用户填入真实密钥 |
| `localhost` | `app.js`, `api.js` | 开发环境使用，部署时修改 |

---

## 📋 完整的上传步骤

```bash
# 1. 确保 .gitignore 正确配置

# 2. 删除本地敏感文件（仅保留示例）
# backend/.env 内容改为占位符

# 3. 添加所有文件
git add .

# 4. 提交（不包含 .env）
git commit -m "Initial commit - ready for deployment"

# 5. 推送到 GitHub
git push origin main
```

---

## 🌍 部署后需要手动修改的配置

### 微信小程序

| 文件 | 修改内容 |
|------|----------|
| `miniprogram/app.js` | `apiUrl` 改为 `https://your-domain.com/api` |
| `miniprogram/utils/api.js` | `BASE_URL` 改为 `https://your-domain.com/api` |

### Web 前端

| 文件 | 修改内容 |
|------|----------|
| 无需修改 | 前端使用相对路径 `/api`，Nginx 自动代理 |

### 后端

| 文件 | 修改内容 |
|------|----------|
| `backend/.env` | 填入真实的 `MONGODB_URI` 和 `DEEPSEEK_API_KEY` |

---

## ✅ 最终检查清单

- [ ] `.env` 不包含真实 API Key
- [ ] `.gitignore` 包含 `node_modules/`
- [ ] `.gitignore` 包含 `*.env`
- [ ] 小程序 `app.js` 和 `api.js` 使用 `localhost` 或域名
- [ ] README 不包含敏感截图
- [ ] 已删除本地调试用的敏感数据

---

## 💡 推荐的团队协作流程

1. **主仓库** (GitHub) - 不包含任何敏感信息
2. **部署配置** - 由运维单独管理，存储在安全的地方
3. **文档** - README 说明如何配置，不包含真实密钥

这样即使代码泄露，攻击者也无法获取真实的 API 密钥和数据库凭证。