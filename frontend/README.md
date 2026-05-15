# 智墒巡田 Web 管理平台

四足机器人田间智能感知系统的 Web 管理界面。

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 开发环境启动（端口 3002）
npm start

# 生产环境构建
npm run build
```

## 📁 项目结构

```
src/
├── components/       # React 组件
│   ├── Dashboard.tsx  # 数据仪表盘
│   ├── SoilData.tsx  # 土壤数据管理
│   ├── CropData.tsx  # 作物数据管理
│   ├── WeatherData.tsx # 天气数据
│   ├── LocationMap.tsx  # 位置地图
│   ├── AIAnalysis.tsx   # AI 分析
│   └── Analysis.tsx     # 数据分析
├── App.tsx
├── App.css
└── index.tsx
```

## 🔗 API 配置

开发环境下，API 请求通过 `package.json` 中的 proxy 配置代理到后端：

```json
"proxy": "http://localhost:3001"
```

**重要：** 部署到生产环境时，需要配置 Nginx 反向代理：

```nginx
location /api {
    proxy_pass http://localhost:3001;
}
```

## 🛠 技术栈

- React 18
- TypeScript
- Axios
- Recharts（图表）
- CSS

## 📱 功能列表

- [x] 数据仪表盘
- [x] 土壤数据管理（增删改查）
- [x] 作物数据管理
- [x] 天气数据展示
- [x] 机器人位置地图
- [x] AI 智能分析
- [x] 数据统计分析

## 📄 许可证

MIT