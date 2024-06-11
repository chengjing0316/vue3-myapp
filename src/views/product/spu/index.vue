<template>
  <div>
    <!-- 三级分类全局组件 -->
    <Category :scene="scene"></Category>
    <el-card style="margin: 10px 0">
      <div v-show="scene == 0">
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
          @click="addSpu"
        >
          添加SPU
        </el-button>
        <!-- 展示已有SPU属性 -->
        <el-table style="margin: 10px 0" border :data="records">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column
            label="SPU描述"
            prop="description"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="SPU操作">
            <template #default="scope">
              <el-button
                type="primary"
                size="small"
                @click=""
                icon="Plus"
                title="添加SKU"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                @click="updateSpu(scope.row)"
                icon="Edit"
                title="修改SPU"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                @click=""
                icon="View"
                title="查看SKU列表"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                @click=""
                icon="Delete"
                title="删除SPU"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          @size-change="sizeChange"
          v-model:currentPage="pageNo"
          v-model:page-size="pageSize"
          layout="prev, pager, next, jumper,->,sizes,total"
          :total="total"
          :page-sizes="[3, 5, 7, 9]"
          :background="true"
          @current-change="getHasSpu"
        ></el-pagination>
      </div>
      <!-- 添加SPU -->
      <SpuForm
        ref="spu"
        v-show="scene == 1"
        @changeScene="changeScene"
      ></SpuForm>
      <!-- 添加SKU -->
      <SkuForm ref="sku" v-show="scene == 2"></SkuForm>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import type {
  HasSpuResponseData,
  Records,
  SpuData,
} from '@/api/product/spu/type'
import { ref, watch } from 'vue'
import useCategoryStore from '@/store/modules/category'
import { reqHasSpu } from '@/api/product/spu'
import SpuForm from './components/spuForm.vue'
import SkuForm from './components/skuForm.vue'

let categoryStore = useCategoryStore()
//场景的数据
let scene = ref<number>(0) //0 显示已有SPU，1 添加与修改SPU 2 添加SKU
//分页器默认页码
let pageNo = ref<number>(1)
//每一页展示几条数据
let pageSize = ref<number>(5)
// 存储已有SPU数据
let records = ref<Records>([])
// 存储已有SPU总个数
let total = ref<number>(0)
// 获取子组件实例SpuForm
let spu = ref<any>()
const sizeChange = () => {
  getHasSpu()
}
//监听三级分类ID变化
watch(
  () => categoryStore.c3Id,
  () => {
    getHasSpu()
  },
)
//此方法执行：可获取某一个三级分类下全部的已有的SPU
const getHasSpu = async (pager = 1) => {
  //修改当前页码
  pageNo.value = pager
  let result: HasSpuResponseData = await reqHasSpu(
    pageNo.value,
    pageSize.value,
    categoryStore.c3Id,
  )
  if (result.code == 200) {
    records.value = result.data.records
    total.value = result.data.total
  }
}

//添加新的SPU按钮的回调
const addSpu = () => {
  //切换为场景1
  scene.value = 1
}
//修改已有SPU按钮的回调
const updateSpu = (row: SpuData) => {
  //切换为场景1
  scene.value = 1
  //调用子组件实例方法获取完整已有的SPU数据
  spu.value.initHasSpuData(row)
}
//子组件SpuForm绑定的自定义事件
const changeScene = (num: number) => {
  // 子组件点击取消变为场景0
  scene.value = num
}
</script>

<style scoped lang="scss"></style>
