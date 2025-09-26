import request from "../request";
import type {Image}  from "../../types/images";
export  async function getLatestKonachanApi(params = { page: 1 }):Promise<Image> {
    // 直接请求后端接口
    return await request(`/latest?page=${params.page}`, {
        method: "GET",
        ...params
    },'konachan');
}