import request from "../request";
import type {Image}  from "../../types/images";
export  async function getSearchWallhavenApi(params = { keyword : '',page:1 }):Promise<Image[]> {
    // 直接请求后端接口
    return await request(`/search?kw=${params.keyword}&page=${params.page}`,{
        method: "GET",
        ...params
    }, 'wallhaven');
}