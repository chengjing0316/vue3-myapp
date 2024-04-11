import SvgIcon from './SvgIcon/index.vue'
import Pagination from './Pagination/index.vue'
import Category from './Category/index.vue'
//引入element-plus提供全部图标组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//全局对象
const allGlobalComponent = { SvgIcon, Pagination, Category }
//对外暴露插件对象
//务必叫做install方法
const install = function (app: any) {
  //注册项目全部的全局组件
  Object.entries(allGlobalComponent).forEach(([key, value]) => {
    //注册为全局组件
    app.component(key, value)
  })
  //将图标注册为全局组件，可以直接用
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
}

export default install
