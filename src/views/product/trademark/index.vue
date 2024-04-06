<template>
  <div>
    <el-card>
      <!-- 卡片顶部增加品牌按钮 -->
      <el-button type="primary" size="default" icon="plus">添加品牌</el-button>
      <!-- 表格组件：用于展示已有的平台数据 -->
      <el-table style="margin: 10px 0px" border :data="trademarkArr">
        <el-table-column
          label="序号"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column label="品牌名称"></el-table-column>
        <el-table-column label="品牌LOGO"></el-table-column>
        <el-table-column label="品牌操作"></el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="limit"
        :page-sizes="[3, 5, 7, 9]"
        :background="true"
        :total="total"
        layout="prev,pager,next,jumper,->,sizes,total"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {reqHasTrademark} from '@/api/product/trademark'
//当前页码
let pageNo = ref<number>(1)
//每一页展示多少条数据
let limit = ref<number>(3)
//存储已有品牌数据的总数
let total = ref<number>(0)
//存储已有品牌的数据
let trademarkArr = ref<any>([])
//获取已有品牌的接口封装为一个函数：在任何情况下向获取数据，调用次函数即可
const getHasTrademark = async() => {
  let result = await reqHasTrademark(pageNo.value, limit.value)
  total.value = result.data.total
  trademarkArr.value =
}
//组件挂载完毕钩子---发一次请求，获取第一页、一页三个已有品牌数据
onMounted(() => {
  getHasTrademark()
})
</script>

<style scoped lang="scss"></style>
