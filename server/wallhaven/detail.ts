import express from "express";
import request from "../request";
import type { ImageDetail, WallhavenDetailResponse, Purity } from "../../src/types/images";
const router = express.Router();
router.get("/:id", async (req, res) => {
  try {
    const {data} = await request<WallhavenDetailResponse>("wallhaven", `w/${req.params.id}`);
    
    const ImageDetail: ImageDetail = {
      id: data.id,
      source: "wallhaven",
      height: data.dimension_y,
      width: data.dimension_x,
      purity: data.purity as Purity,
      sample: data.thumbs.small,
      url: data.path,
      resolution: data.resolution,
      created_at:data.created_at,
      tags:data.tags.map(tag=>tag.name),
      fileSize:data.file_size
    }
    res.json(ImageDetail);
  } catch {
    res.status(500).json({ error: "Failed to fetch wallhaven detail" });
  }
});
export default router;