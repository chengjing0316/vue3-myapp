//类型定义
//用户登录接口携带参数的ts类型
export interface loginFormData{
  username: string
  password: string
}
export interface ResponseData {
  code: number
  message:string
  ok:boolean
}

//登录接口返回数据类型
export interface loginResponseData extends ResponseData{
  data: string
}
export interface userInfoResponseData extends ResponseData{
    data:{
        routes:string[]
        buttons: string[]
        roles: string[]
        name:string
        avatar: string
    }
}


