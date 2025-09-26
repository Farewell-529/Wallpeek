import request from "../request";
import type {ImageDetail}  from "../../types/images";
// 获取 wallhaven 图片详情
export  function getWallhavenDetailApi  (id: string):Promise<ImageDetail>  {
  return request(`/detail/${id}`, {
        method: "GET",
    },"wallhaven");
};
