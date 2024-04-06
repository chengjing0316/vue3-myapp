//路由鉴权（某个路由什么条件下能访问，什么条件下不能访问）
import router from '@/router'
//引入进度条工具
import nprogress from 'nprogress'
//引入进度条样式
import "nprogress/nprogress.css"
//引入用户相关小仓库，判断是否登录成功
import useUserStore from './store/modules/user'
import pinia from './store'
import setting from './setting.ts'
let userStore = useUserStore(pinia)
nprogress.configure({ showSpinner: false })

// 全局守卫：项目当中任意路由切换都会触发的钩子

//全局前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
    document.title = `${setting.title} - ${to.meta.title}`
    nprogress.start()
    //获取token来判断用户登录还是未登录
    let token = userStore.token
    //获取用户名字
    let username = userStore.username
    //用户登录判断
    if (token) {
        //登录成功，访问login,不能访问，指向首页
        if (to.path == '/login') {
            next({ path: '/' })
        } else {
            //登录成功访问其余六个路由（登录排除）
            //有用户信息,放行
            if (username) {
                next()
            } else {
                //如果没有用户信息,在守卫这里发起请求获取到了用户信息再放行
                try {
                    // 获取用户信息后进行放行
                    await userStore.userInfo()
                    next()
                } catch (error) {
                    //（1）token过期：获取不到用户信息了
                    //（2）用户手动修改了本地存储
                    //解决：退出登录->用户相关数据清空->回到登录页重新登录
                    await userStore.userLogout()
                    next({ path: '/login', query: { redirect: to.path } })
                }
            }

        }
    } else {
        //用户未登录判断
        if (to.path == '/login') {
            next()
        } else {
            next({ path: '/login', query: { redirect: to.path } })
        }
    }
})

//全局后置守卫
router.afterEach((to: any, from: any) => {
    nprogress.done()
})