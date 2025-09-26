import express from "express";
import request from "../request";
import type { ImageDetail, KonachanPost } from "../../src/types/images";
import type { Purity } from "../../src/types/images";
const router = express.Router();
router.get("/:id", async (req, res) => {
    try {
        const data = await request<KonachanPost[]>("konachan", `post.json`, { tags: `id:${req.params.id}` });
        const detail = data[0]; // ✅ 取第一个元素
        const ImageDetail: ImageDetail = {
            id: detail.id,
            source: "konachan",
            height: detail.height,
            width: detail.width,
            purity: (detail.rating === "s" ? "sfw" : "nsfw") as Purity,
            sample: detail.preview_url,
            url: detail.jpeg_url,
            resolution: `${detail.width}x${detail.height}`,
            created_at: detail.created_at,
            tags: detail.tags ? detail.tags.split(" ") : [],
            fileSize: detail.file_size
        }
        res.json(ImageDetail);
    } catch {
        res.status(500).json({ error: "Failed to fetch konachan detail" });
    }
});
export default router;