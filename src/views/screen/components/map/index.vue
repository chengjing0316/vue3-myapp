<template>
  <div class="box4" ref="map">地图组件</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
//引入中国地图的JSON数据
import chinaJSON from './china.json'
//获取DOM元素
let map = ref()
//注册中国地图
echarts.registerMap('china', chinaJSON as any)
onMounted(() => {
  let mychart = echarts.init(map.value)
  // 设置配置项
  mychart.setOption({
    //地图组件
    geo: {
      map: 'china', //中国地图
      roam: true, //鼠标缩放的效果
      left: 10,
      top: 50,
      right: 10,
      bottom: 0,
      // zoom: 2,
      //地图上文字的设置
      label: {
        show: true,
        color: 'white',
        fontSize: 14
        // rotate: 20
      },
      //每一个多边形样式
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgb(1,52,134)' // 0% 处的颜色
            },
            {
              offset: 1,
              color: 'rgb(2,2,48)' // 100% 处的颜色
            }
          ],
          global: false // 缺省为 false
        },
        borderColor: 'white',
        shadowColor: 'rgb(19,135,200)',
        shadowBlur: 30,
        opacity: 0.8
      },
      //地图高亮效果
      emphasis: {
        itemStyle: {
          color: 'rgb(2,2,48)'
        },
        label: {
          color: 'orange'
        }
      }
    },
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    },
    series: [
      {
        type: 'lines', //航线的系列
        data: [
          {
            coords: [
              [116, 39], //起点
              [119, 26] //终点
            ],
            //统一的样式设置
            lineStyle: {
              color: 'white',
              width: 2,
              //边的曲度，支持从0到1的值，值越大曲度越大
              curveness: 0.15
            }
          },
          {
            coords: [
              [116, 39],
              [104, 30]
            ],
            //统一的样式设置
            lineStyle: {
              color: 'white',
              width: 1,
              //边的曲度，支持从0到1的值，值越大曲度越大
              curveness: 0.15
            }
          },
          {
            coords: [
              [104, 30],
              [116, 39]
            ],
            //统一的样式设置
            lineStyle: {
              color: 'white',
              width: 2,
              //边的曲度，支持从0到1的值，值越大曲度越大
              curveness: 0.15
            }
          },
          {
            coords: [
              [112, 22],
              [116, 39]
            ],
            //统一的样式设置
            lineStyle: {
              color: 'white',
              width: 2,
              //边的曲度，支持从0到1的值，值越大曲度越大
              curveness: 0.15
            }
          },
          {
            coords: [
              [116, 39],
              [112, 22]
            ],
            //统一的样式设置
            lineStyle: {
              color: 'white',
              width: 1,
              //边的曲度，支持从0到1的值，值越大曲度越大
              curveness: 0.15
            }
          },
          {
            coords: [
              [104, 30],
              [86, 42]
            ],
            //统一的样式设置
            lineStyle: {
              color: 'white',
              width: 1,
              //边的曲度，支持从0到1的值，值越大曲度越大
              curveness: 0.15
            }
          },
          {
            coords: [
              [86, 42],
              [104, 30]
            ],
            //统一的样式设置
            lineStyle: {
              color: 'white',
              width: 1,
              //边的曲度，支持从0到1的值，值越大曲度越大
              curveness: 0.15
            }
          }
        ],
        // 开启动画特效,飞机飞行特效
        effect: {
          show: true,
          //飞行的飞机图标
          symbol:
            'path://M896 682.666667 896 597.333333 554.666667 384 554.666667 149.333333C554.666667 113.92 526.08 85.333333 490.666667 85.333333 455.253333 85.333333 426.666667 113.92 426.666667 149.333333L426.666667 384 85.333333 597.333333 85.333333 682.666667 426.666667 576 426.666667 810.666667 341.333333 874.666667 341.333333 938.666667 490.666667 896 640 938.666667 640 874.666667 554.666667 810.666667 554.666667 576 896 682.666667Z',
          color: 'white',
          //大小
          symbolSize: 20,
          //尾迹
          trailLength: 0
        }
      }
    ]
  })
})
</script>
<style scoped></style>
