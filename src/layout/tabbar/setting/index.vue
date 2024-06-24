<template>
  <el-button icon="Refresh" circle @click="updateRefresh" />
  <el-button icon="FullScreen" circle @click="fullScreen" />
  <el-popover trigger="hover" :width="300" placement="bottom" title="主体设置">
    <!-- 表单元素 -->
    <el-form>
      <el-form-item label="主题颜色">
        <el-color-picker
          v-model="color"
          show-alpha
          :predefine="predefineColors"
          size="small"
          @change="setColor"
          :teleported="false"
        />
      </el-form-item>
      <el-form-item label="暗黑模式">
        <el-switch
          v-model="isDark"
          size="small"
          active-icon="MoonNight"
          inactive-icon="Sunny"
          inline-prompt
          @change="toggleDark"
        ></el-switch>
      </el-form-item>
    </el-form>
    <template #reference>
      <el-button icon="Setting" circle />
    </template>
  </el-popover>
  <img
    :src="userStore.avatar"
    style="width: 32px; height: 32px; border-radius: 50%; margin-left: 12px"
  />
  <!-- 下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
//获取骨架的小仓库
import useLayOutSettingStore from '@/store/modules/setting'
import useUserStore from '@/store/modules/user'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDark, useToggle } from '@vueuse/core'
//获取用户相关小仓库
let layOutSettingStore = useLayOutSettingStore()
let userStore = useUserStore()
//获取路由器对象
let $router = useRouter()
//获取路由对象
let $route = useRoute()
//收集开关的数据
// let dark = ref<boolean>(false)
const isDark = useDark()
//切换开关
const toggleDark = useToggle(isDark)
//刷新按钮点击回调
const updateRefresh = () => {
  layOutSettingStore.refresh = !layOutSettingStore.refresh
}
//全屏按钮点击回调
const fullScreen = () => {
  //DOM对象的一个属性，可以用来判断当前是不是全屏模式
  let full = document.fullscreenElement
  if (!full) {
    //文档根节点的方法requestFullscreen实现全屏模式
    document.documentElement.requestFullscreen()
  } else {
    //变为不是全屏的模式
    document.exitFullscreen()
  }
}
//退出登录
const logout = async () => {
  //1、向服务器发起请求【退出登录接口】
  //2、清空仓库相关数据
  //3、跳转到登录页面
  await userStore.userLogout()
  $router.push({ path: '/login', query: { redirect: $route.path } })
}

//颜色组件需要数据
const color = ref('rgba(255,69,0,0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577'
])
//进行暗黑模式切换
// const changeDark = () => {
//   // //获取html根节点
//   // let html = document.documentElement
//   // //判断html标签是否有类名dark
//   // html.className = dark.value ? 'dark' : ''
// }
//通知js修改根节点的样式对象的属性与属性值
const setColor = () => {
  let html = document.documentElement
  html.style.setProperty('--el-color-primary', color.value)
}
</script>

<script lang="ts">
export default {
  name: 'Setting'
}
</script>

<style scoped></style>
