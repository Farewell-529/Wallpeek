import fetch, { RequestInit as NodeFetchRequestInit } from "node-fetch";
import type { Source } from "../src/types/images";
const baseURLs: Record<Source, string> = {
  wallhaven: "https://wallhaven.cc/api/v1",
  konachan: "https://konachan.net",
  gelbooru: "https://gelbooru.com",
  zerochan: "https://zerochan.net",
  image: ""
};
interface RequestOptions extends NodeFetchRequestInit {
  headers?: Record<string, string>;
  method?: string;
}

const request = <T=unknown>(
  source: Source,
  endpoint?: string,
  params: Record<string, string | number> = {},
  options: RequestOptions = {},
): Promise<T> => {
  const url = new URL(`${baseURLs[source]}/${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });
  console.log("请求地址：", url.toString());
  return fetch(url.toString(), {
    // agent,
    headers: {
      'Accept': 'application/json',
      ...options.headers
    },
    ...options,
  }).then(async (response) => {
    if (!response.ok) {
      // 打印完整响应内容
      console.error("请求失败：", {
        status: response.status,
        statusText: response.statusText,
      });
      throw new Error(`请求失败: ${response.status} ${response.statusText}`);
    }
    return response.json() as T;
  });
};

export default request;