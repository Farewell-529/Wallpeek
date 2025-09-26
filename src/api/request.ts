import type { Source } from "../types/images";

// 自动根据环境选择 API 地址
// 开发时 (pnpm run dev) 使用 .env.development 中的配置
// 打包时 (pnpm run build) 使用 .env.production 中的配置
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";


// RequestOptions 继承了 fetch 的 RequestInit 类型，
// 并允许自定义 headers 和 method，方便类型推断和智能提示。
interface RequestOptions extends RequestInit {
    headers?: Record<string, string>;
    method?: string;
}
const request = async<T=unknown> (
    endpoint: string,
    options: RequestOptions = {},
    source?: Source,
): Promise<T> => {
    const url = `${baseURL}/${source}${endpoint}`; 
    // 默认 headers
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    const response = await fetch(url, {
        ...options,
        headers,
    });
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }
    // 统一返回数据
    return response.json();
};

export default request;