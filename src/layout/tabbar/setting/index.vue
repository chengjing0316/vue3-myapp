<template>
  <el-button icon="Refresh" circle @click="updateRefresh" />
  <el-button icon="FullScreen" circle @click="fullScreen" />
  <el-button icon="Setting" circle />
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
import { useRoute, useRouter } from 'vue-router'
//获取用户相关小仓库
let layOutSettingStore = useLayOutSettingStore()
let userStore = useUserStore()
//获取路由器对象
let $router = useRouter()
//获取路由对象
let $route = useRoute()
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
</script>

<script lang="ts">
export default {
  name: 'Setting',
}
</script>

<style scoped></style>
