# 🌄 Wallpeek — 壁纸聚合网站

> Wallpeek 是一个基于 React + Express.js 构建的高颜值壁纸聚合网站，参考 [MiaoMint/wallpaper](https://github.com/MiaoMint/wallpaper)
 项目实现，整合了 Wallhaven 与 Konachan 等热门壁纸源。


![image](https://github.com/user-attachments/assets/ce097284-2157-4856-a876-8ebc328e20d4)
![image](https://github.com/user-attachments/assets/712fc632-b15c-4e14-a9c9-fb8196bfc64c)

---

## 🚀 项目简介

**Wallpaper** 是一个轻量级、可扩展的壁纸聚合平台，支持多站点壁纸浏览与搜索，拥有现代化的 UI 和快速响应的后端代理服务。
非常适合用作 全栈练习项目 或 个人部署使用。

---

## ✨ 功能亮点

- 🔍 **壁纸源整合**：目前支持 [Wallhaven](https://wallhaven.cc) 和 [Konachan](https://konachan.com) 两大壁纸源。
- ⚡ **响应迅速**：使用 Express.js 构建轻量后端，代理请求加速访问。
- 🎨 **现代 UI**：前端基于 React 和 Tailwind CSS，简洁优雅。
- 🖼️ **高清预览**：支持懒加载、高清图展示与分类浏览。
- 🛠️ **组件化设计**：易于扩展和维护，方便添加更多壁纸源。

---

## 🧱 技术栈

### 前端
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)

### 后端
- [Express.js](https://expressjs.com/) --- 提供壁纸源代理与统一 API 服务

---

## 📦 项目结构

# Wallpaper Project Structure

``` bash
├── server/           # Backend code (Express API)
│   ├── wallhaven/    # Wallhaven source related logic
│   ├── konachan/     # Konachan source related logic
│   ├── images/       # Proxy image requests
│   └── request.ts    # Common request wrapper
│
├── src/              # Frontend code (React)
│   ├── api/          # API integration
│   ├── components/   # Reusable components
│   ├── context/      # Global source state
│   ├── pages/        # Page components
│   ├── router/       # Route configuration
│   └── App.tsx       # Application entry
│
├── public/           # Public assets
├── tailwind.config.js
└── package.json
```

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/Farewell-529/wallpaper.git
cd wallpaper
```
### 2. 安装依赖
```bash
pnpm install
```
### 3. 启动前端
```bash
pnpm dev
```
### 4. 启动后端
```bash
pnpm run server
```
