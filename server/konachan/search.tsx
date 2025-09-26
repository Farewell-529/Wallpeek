import express from "express";
import request from "../request";
import type { Purity, KonachanPost } from "../../src/types/images";
const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const data = await request<KonachanPost[]>(
            "konachan",
            "post.json",
            {
                limit: 24,
                tags: `rating:safe ${req.query.keyword}`,
                page: Number(req.query.page || 1)
            },
            { method: "GET" }
        );
        //只返回需要的字段
        const result = data.map((item) => ({
            id: item.id,
            source: "konachan",
            height: item.height,
            width: item.width,
            purity: (item.rating === "s" ? "sfw" : "nsfw") as Purity,
            sample: item.preview_url,
            url: item.jpeg_url,
            resolution: `${item.width}x${item.height}`,
        }));
        res.json(result);
    } catch {
        res.status(500).json({ error: "Failed to fetch konachan latest" });
    }
})

export default router;