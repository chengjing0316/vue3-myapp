//layout组件相关的小仓库

import { defineStore } from 'pinia'

let useLayOutSettingStore = defineStore('SettingStore', {
  state: () => {
    return {
      fold: false, //控制菜单折叠收起
      refresh: false, //用于控制刷新效果
      themeConfig: {
        theme: '#409eff', //主题颜色
        isDark: false
      }
    }
  },
  actions: {
    // 设置主题
    setThemeConfig(key: string, value: boolean) {
      this.themeConfig = { ...this.themeConfig, [key]: value }
    }
  }
})
export default useLayOutSettingStore
