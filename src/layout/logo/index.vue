<template>
  <div class="logo" v-if="setting.logoHidden">
    <img :src="setting.logo" />
    <span class="title">{{ setting.title }}</span>
  </div>
</template>

<script setup lang="ts">
//引入设置标题与logo这配置文件
import setting from '@/setting'
</script>

<script lang="ts">
export default {
  name: 'Logo'
}
</script>

<style scoped lang="scss">
.logo {
  width: 95%;
  display: flex;
  align-items: center;
  height: $base-menu-logo-height;
  color: #959ea6;
  font-weight: 700;
  flex-wrap: nowrap;
  overflow: hidden;
  padding-left: 17px;
  img {
    display: inline-block;
    widows: 30px;
    height: 30px;
    border-radius: 10px;
  }
  .title {
    display: inline-block;
    height: 32px;
    margin: 2px 0 0 18px;
    overflow: hidden;
    font-size: 18px;
    font-weight: 600;
    line-height: 32px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
