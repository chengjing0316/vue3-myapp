<template>
  <div class="box">
    <div class="top">
      <p class="title">实时游客统计</p>
      <p class="bg"></p>
      <p class="right">
        可预约总量
        <span>99999</span>
        人
      </p>
    </div>
    <div class="number">
      <span v-for="(item, index) in people" :key="index">{{ item }}</span>
    </div>
    <!-- 展示图表 -->
    <div class="charts"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'
let people = ref('215908')
let charts = ref()
onMounted(() => {
  //获取echarts类的示例
  let mycharts = echarts.init(charts.value)
  //设置实例的配置项
  mycharts.setOption({
    title: { text: 'water' },
    xAxis: {},
    yAxis: {},
    series: { type: 'bar', data: [10, 20, 30, 40] },
    grid: {
      left: 0,
      top: 0,
      bottom: 0,
      right: 0
    }
  })
})
</script>

<style scoped lang="scss">
.box {
  background: url(../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 10px;
  .top {
    margin-left: 20px;
    .title {
      color: white;
      font-size: 25px;
    }
    .bg {
      width: 68px;
      height: 7px;
      background: url(../../images/dataScreen-title.png);
      background-size: 100% 100%;
      margin-top: 10px;
    }
    .right {
      float: right;
      color: white;
      font-size: 20px;
      span {
        color: yellowgreen;
      }
    }
  }
  .number {
    padding: 10px;
    margin-top: 30px;
    display: flex;
    span {
      flex: 1;
      height: 40px;
      text-align: center;
      line-height: 40px;
      background: url(../../images/total.png);
      background-size: 100% 100%;
      color: #29fcfc;
    }
  }
  .charts {
    width: 100%;
    height: 250px;
    background-color: red;
  }
}
</style>
