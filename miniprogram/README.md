# 智墒巡田 微信小程序

四足机器人田间智能感知系统的微信小程序客户端。

## 🚀 快速开始

### 1. 配置 API 地址

**重要：** 使用前必须配置后端 API 地址！

#### 方式一：修改 app.js

打开 `app.js`，修改 `globalData.apiUrl`：

```javascript
globalData: {
  apiUrl: 'http://你的服务器IP:3001/api',  // 开发环境
  // 或
  apiUrl: 'https://你的域名.com/api',      // 生产环境
}
```

#### 方式二：修改 utils/api.js

打开 `utils/api.js`，修改 `BASE_URL`：

```javascript
const BASE_URL = 'http://你的服务器IP:3001/api';  // 开发环境
// 或
const BASE_URL = 'https://你的域名.com/api';       // 生产环境
```

### 2. 导入项目

1. 打开微信开发者工具
2. 点击"导入项目"
3. 选择本目录
4. 填写 AppID（可使用测试号）

### 3. 配置服务器域名

在微信公众平台后台 → 开发管理 → 开发设置 → 服务器域名，添加：
- request 合法域名：`https://你的域名.com`（或 `http://你的IP:端口` 用于开发）

## 📁 项目结构

```
miniprogram/
├── images/           # 导航图标
├── pages/
│   ├── index/        # 数据概览首页
│   ├── soil/         # 土壤数据
│   ├── crop/         # 作物数据
│   ├── ai/           # AI 智能助手
│   ├── analysis/      # 数据分析
│   ├── profile/       # 个人中心
│   └── login/         # 登录页面
├── scripts/          # 工具脚本
├── utils/            # 工具函数
├── app.js            # 应用入口
├── app.json          # 应用配置
├── app.wxss          # 全局样式
└── project.config.json # 项目配置
```

## 🛠 技术栈

- 原生微信小程序框架
- WXML + WXSS + JavaScript
- 微信小程序组件

## 📱 功能列表

| 页面 | 功能说明 |
|------|----------|
| 数据概览 | 最新数据、机器人状态、关键指标 |
| 土壤数据 | 土壤温度、湿度、EC值等 |
| 作物数据 | 作物生长数据、健康状况 |
| AI 分析 | DeepSeek AI 智能农业分析 |
| 个人中心 | 用户信息、功能入口、退出登录 |

## 🔐 默认账号

```
账号：admin
密码：admin123
```

> ⚠️ 建议首次使用后修改密码

## 📡 API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/auth/login` | POST | 用户登录 |
| `/api/soil` | GET | 获取土壤数据 |
| `/api/crop` | GET | 获取作物数据 |
| `/api/analysis/statistics` | GET | 数据统计 |
| `/api/ai/drought-analysis` | POST | 干旱分析 |
| `/api/ai/crop-prediction` | POST | 作物预测 |

## 🐛 常见问题

### Q: 图标不显示
A: 检查 `images/` 目录下的 PNG 文件是否存在且格式正确

### Q: 请求失败
A: 检查：
1. 后端服务是否启动
2. API 地址是否配置正确
3. 是否已添加服务器域名白名单

### Q: 登录无反应
A: 检查后端 API 是否正常运行，浏览器控制台查看错误信息

## 📄 许可证

MIT