import request from "../request";
import type {Image}  from "../../types/images";
export  async function getSearchKonachanApi(params = {keyword:'', page: 1 }):Promise<Image> {
    // 直接请求后端接口
    return await request(`/search?page=${params.page}&keyword=${params.keyword}`, {
        method: "GET",
        ...params
    },'konachan');
}