//书写品牌管理模块接口
import request from '@/utils/request'

//品牌管理模块接口地址
enum API{
    //获取已有品牌接口
    TRADEMARK_URL = "/admin/product/baseTrademark/"
}
//获取已有品牌的接口方法
export const reqHasTrademark = (page:number,limit:number) => request.get(API.TRADEMARK_URL + `${page}/${limit}`)
