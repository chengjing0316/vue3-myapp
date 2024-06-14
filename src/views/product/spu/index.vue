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
                @click="addSku(scope.row)"
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
                @click="findSku(scope.row)"
                icon="View"
                title="查看SKU列表"
              ></el-button>
              <el-popconfirm
                :title="`你确定删除${row.spuName}?`"
                width="200px"
                @confirm="deleteSpu(row)"
              >
                <el-button
                  type="primary"
                  size="small"
                  @click=""
                  icon="Delete"
                  title="删除SPU"
                ></el-button>
              </el-popconfirm>
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
      <SkuForm
        ref="sku"
        v-show="scene == 2"
        @changeScene="changeScene"
      ></SkuForm>
      <!-- 查看SKU -->
      <el-dialog v-model="show" title="SKU列表">
        <el-table :data="skuArr">
          <el-table-column label="SKU名字" prop="skuName"></el-table-column>
          <el-table-column label="SKU价格" prop="price"></el-table-column>
          <el-table-column label="SKU重量" prop="weight"></el-table-column>
          <el-table-column label="SKU图片">
            <template #="{ row, $index }">
              <img
                :src="row.skuDefaultImg"
                alt=""
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import type {
  HasSpuResponseData,
  Records,
  SkuData,
  SkuInfoData,
  SpuData
} from '@/api/product/spu/type'
import { onBeforeUnmount, ref, watch } from 'vue'
import useCategoryStore from '@/store/modules/category'
import { reqHasSpu, reqSkuList } from '@/api/product/spu'
import SpuForm from './components/spuForm.vue'
import SkuForm from './components/skuForm.vue'
import { ElMessage } from 'element-plus'
import { reqRemoveAttr } from '@/api/product/attr'

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
let sku = ref<any>()
let skuArr = ref<SkuData[]>([])
let show = ref<boolean>(false)

const sizeChange = () => {
  getHasSpu()
}
//监听三级分类ID变化
watch(
  () => categoryStore.c3Id,
  () => {
    getHasSpu()
  }
)
//此方法执行：可获取某一个三级分类下全部的已有的SPU
const getHasSpu = async (pager = 1) => {
  //修改当前页码
  pageNo.value = pager
  let result: HasSpuResponseData = await reqHasSpu(
    pageNo.value,
    pageSize.value,
    categoryStore.c3Id
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
  //点击添加SPU,调用子组件的方法初始化数据
  spu.value.initAddSpu()
}
//修改已有SPU按钮的回调
const updateSpu = (row: SpuData) => {
  //切换为场景1
  scene.value = 1
  //调用子组件实例方法获取完整已有的SPU数据
  spu.value.initHasSpuData(row)
}
//子组件SpuForm绑定的自定义事件
const changeScene = (obj: any) => {
  scene.value = obj.flag
  if (obj.params == 'update') {
    //更新留在当前页
    getHasSpu(pageNo.value)
  } else {
    //添加留在第一页
    getHasSpu()
  }
}
// 添加SKU按钮的回调
const addSku = (row: SpuData) => {
  //点击添加SKU按钮切换为场景2
  scene.value = 2
  //调用子组件的方法初始化添加SKU的数据
  sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}

//查看SKU
const findSku = async (row: SpuData) => {
  let res: SkuInfoData = await reqSkuList(row.id as number)
  if (res.code === 200) {
    skuArr.value = res.data
    show.value = true
  }
}
//删除
const deleteSpu = async (row: SpuData) => {
  let res: any = await reqRemoveAttr(row.id as number)

  if (res.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getHasSpu(records.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败'
    })
  }
}
//路由组件销毁前，清空仓库关于分类的数据
onBeforeUnmount(() => {
  categoryStore.$reset()
})
</script>

<style scoped lang="scss"></style>
