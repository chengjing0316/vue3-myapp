<template>
  <div>
    <el-card>
      <div class="box">
        <img :src="userStore.avatar" alt="暂无图片" class="avatar" />
        <div class="footer">
          <h3 class="title">{{ getTime() }}好呀{{ userStore.username }}</h3>
          <p class="subtitle">硅谷甄选运营平台</p>
        </div>
      </div>
    </el-card>
    <div class="bottom">
      <svg-icon name="welcome" style="width: 600px; height: 300px"></svg-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getTime } from '@/utils/time'
import useUserStore from '@/store/modules/user'
let userStore = useUserStore()
</script>

<style scoped lang="scss">
.box {
  display: flex;
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  .footer {
    margin-left: 20px;
    .title {
      font-size: 30px;
      font-weight: 900;
      margin-bottom: 30px;
    }
    .subtitle {
      font-style: italic;
      color: aqua;
    }
  }
}
.bottom {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}
</style>
