export type Source =
  | "wallhaven"
  | "konachan"
  | "gelbooru"
  | "zerochan"
  | "image"
export type Purity = "sfw" | "nsfw"


export interface Image {
  id: string,
  source: string,
  height: number,
  width: number,
  purity: Purity,
  sample: string,
  url: string,
  resolution: string
}
export interface ImageDetail extends Image {
  tags: string[],
  fileSize: string,
  created_at: string,
}

// API 响应类型定义
export interface WallhavenDetailResponse {
  data: {
    id: string;
    dimension_y: number;
    dimension_x: number;
    purity: string;
    thumbs: { small: string };
    path: string;
    resolution: string;
    created_at: string;
    tags: { name: string }[];
    file_size: string;
  };
}

export interface WallhavenSearchResponse {
  data: {
    id: string;
    dimension_y: number;
    dimension_x: number;
    purity: string;
    thumbs: { small: string };
    path: string;
    resolution: string;
  }[];
}

export interface KonachanPost {
  id: string;
  height: number;
  width: number;
  rating: string;
  preview_url: string;
  jpeg_url: string;
  created_at: string;
  tags: string;
  file_size: string;
}