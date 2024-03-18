<script setup lang="ts">
import { ref } from 'vue'
const checked1 = ref(false)
const checked2 = ref(false)
</script>

<template>
  <div>
    <!-- 路由匹配到的组件将渲染在这里 -->
    <router-view></router-view>
  </div>
</template>

<style scoped>
div {
  background-color: #fff;
}
</style>
