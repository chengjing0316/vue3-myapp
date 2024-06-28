//创建用户相关的小仓库
import { defineStore } from 'pinia'
//引入接口
import { reqLogin, reqUserInfo, reqLogOut } from '@/api/user'
//引入数据类型
import type {
  loginFormData,
  loginResponseData,
  userInfoResponseData
} from '@/api/user/type'
import { UserState } from './types/type'
//引入操作本地存储的工具方法
import { GET_TOKEN, SET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
//引入路由（常量路由）
import { constantRoute, asyncRoute, anyRoute } from '@/router/routes'
import router from '@/router'
//引入深拷贝方法
//@ts-ignore
import cloneDeep from 'lodash/cloneDeep'
let dynamicRoutes = []
//用于过滤当前用户需要展示的异步路由
function filterAsyncRoute(asyncRoute: any, routes: any) {
  return asyncRoute.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, routes)
      }
      return true
    }
  })
}

//创建用户小仓库
let useUserStore = defineStore('User', {
  //小仓库存储数据的地方
  state: (): UserState => {
    return {
      token: GET_TOKEN(), //用户唯一标识token
      menuRoutes: constantRoute, //仓库存储生成菜单需要数组（路由）
      username: '',
      avatar: '',
      buttons: []
    }
  },
  //异步逻辑的地方
  actions: {
    //用户登录的方法
    async userLogin(data: loginFormData) {
      //登录请求
      let result: loginResponseData = await reqLogin(data)
      //登录请求：成功200->token
      //登录请求：失败201->登录失败错误的信息
      if (result.code === 200) {
        //pinia仓库存储一些token
        this.token = result.data as string //断言
        //本地持久化存储token
        SET_TOKEN(result.data as string) //能保证当前async函数返回一个成功的promise
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data.message))
      }
    },
    //获取用户信息方法
    async userInfo() {
      //获取用户信息
      let result: userInfoResponseData = await reqUserInfo()
      //如果获取用户信息成功，存储一下用户信息
      if (result.code == 200) {
        this.username = result.data.name
        this.avatar = result.data.avatar
        this.buttons = result.data.buttons
        // 计算当前用户需要展示的异步路由
        let userAsyncRoute = filterAsyncRoute(
          cloneDeep(asyncRoute),
          result.data.routes
        )
        //菜单需要的数据整理完毕
        this.menuRoutes = [...constantRoute, ...userAsyncRoute, anyRoute]
        //目前路由器管理的只有常量路由：用户计算完毕异步路由、任意路由动态追加
        dynamicRoutes = [...userAsyncRoute, anyRoute]
        dynamicRoutes.forEach((route) => {
          router.addRoute(route) // 动态添加路由
        })
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    //退出登录
    async userLogout() {
      //退出登录请求
      let result: any = await reqLogOut()
      if (result.code == 200) {
        //目前没有mock接口：退出登录接口（通知服务器本地用户唯一标识失效）
        this.token = ''
        this.username = ''
        this.avatar = ''
        REMOVE_TOKEN()
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    }
  },
  getters: {}
})

export default useUserStore
