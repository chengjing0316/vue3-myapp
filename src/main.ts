import { createApp } from 'vue'
import App from './App.vue'
//引入element-plus插件与样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//配置element-plus国际化
//@ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
//svg插件需要配置代码
import 'virtual:svg-icons-register'
// 引入自定义插件对象：注册整个项目全局组件
import globalComponent from '@/components/index'
//引入模板的全局样式
import '@/styles/index.scss'
//引入路由
import router from './router'
//引入pinia
import pinia from './store'
//引入路由鉴权文件
import './permission'

const app = createApp(App)

app.use(ElementPlus, {
  locale: zhCn
})
//安装自定义插件
app.use(globalComponent)
//注册模板路由
app.use(router)
//安装pinia
app.use(pinia)
app.mount('#app')
