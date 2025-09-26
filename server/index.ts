import express from "express";
import cors from "cors";
import wallhavenLatest from "./wallhaven/latest";
import wallhavenDetail from "./wallhaven/detail";
import wallhavenSearch from "./wallhaven/search";
import konachanLatest from "./konachan/latest";
import konachanDetail from "./konachan/detail";
import konachanSearch from "./konachan/search";
import path from "path";
import { fileURLToPath } from 'url';
import imageProxy from "./image";
// ES modules 中获取 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(cors());
app.use("/api/wallhaven/latest", wallhavenLatest);
app.use("/api/wallhaven/detail", wallhavenDetail);
app.use("/api/wallhaven/search", wallhavenSearch);
app.use("/api/konachan/latest", konachanLatest);
app.use("/api/konachan/detail", konachanDetail);
app.use("/api/konachan/search", konachanSearch);
app.use("/api/image", imageProxy);


// 静态文件服务
app.use(express.static(path.join(__dirname, '../../dist')));

// 所有非 API 路由都返回 index.html，支持前端路由
app.get('*', (req, res) => {
  // 排除 API 路由
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
  }
});

// 错误处理中间件
app.use((err: Error, req: express.Request, res: express.Response) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = 3001;
app.listen(PORT, () => {});