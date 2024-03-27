<template>
  <!-- 顶部左侧静态 -->
  <el-icon style="margin-right: 10px;" @click="changeIcon">
    <component :is="LayOutSettingStore.fold? 'Fold':'Expand'"></component>
  </el-icon>
  <!-- 左侧面包屑 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import useLayOutSettingStore from '@/store/modules/setting';
//从仓库读取响应式数据控制图标切换
let LayOutSettingStore = useLayOutSettingStore()
//点击图标的方法
const changeIcon = () => {
  LayOutSettingStore.fold = !LayOutSettingStore.fold
}
</script>

<script lang="ts">
export default {
  name: "Breadcrumb"
}
</script>


<style scoped></style>
