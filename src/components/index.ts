import SvgIcon from './SvgIcon/index.vue'
import Pagination from './Pagination/index.vue'
// import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const components = {SvgIcon,Pagination}
const install = function (app: App) {
  Object.entries(components).forEach(([key, value]) => {
    app.component(key, value)
  })
  // for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  //   app.component(key, component)
  // }
}

export default install
