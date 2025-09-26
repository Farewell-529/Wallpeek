# 🌄 Wallpeek 壁纸网站

> 一个基于 React + Express.js 的高颜值壁纸网站，整合 Wallhaven 和 Konachan等壁纸源。
![image](https://github.com/user-attachments/assets/ce097284-2157-4856-a876-8ebc328e20d4)
![image](https://github.com/user-attachments/assets/712fc632-b15c-4e14-a9c9-fb8196bfc64c)





---

## 🚀 项目简介

**Wallpaper** 是一个整合型的壁纸平台，用户可以方便地浏览、搜索高清壁纸。项目聚焦于良好的用户体验和整洁的代码结构，适合作为全栈练习项目或实际部署使用。

---

## ✨ 项目特色

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
- [Express.js](https://expressjs.com/)（后端代理请求壁纸 API）

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
