<template>
  <el-form>
    <el-form-item label="SPU名称">
      <el-input placeholder="请输入SPU名称"></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select>
        <el-option></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input type="textarea" placeholder="请你输入SPU描述"></el-input>
    </el-form-item>
    <el-form-item label="SPU图标">
      <el-upload></el-upload>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <!-- 展示销售属性的下拉菜单 -->
      <el-select>
        <el-option label="w"></el-option>
      </el-select>
      <el-button
        style="margin-left: 10px"
        type="primary"
        size="default"
        icon="Plus"
        @click=""
      >
        添加属性值
      </el-button>
      <!-- table展示销售属性与属性值的地方 -->
      <el-table border style="margin: 10px 0">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="80px"
        />
        <el-table-column
          label="销售属性名"
          type="index"
          align="center"
          width="80px"
        />
        <el-table-column
          label="销售属性值"
          type="index"
          align="center"
          width="80px"
        />
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default" @click="">保存</el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import type {
  SpuData,
  AllTradeMark,
  SpuHasImg,
  SaleAttrResponseData,
  HasSaleAttrResponseData,
  Trademark,
  SpuImg,
  SaleAttr,
  HasSaleAttr,
  SaleAttrValue,
  saleAttr,
} from '@/api/product/spu/type'
import {
  reqAllTradeMark,
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAllSalAttr,
  reqAddOrUpdateSpu,
} from '@/api/product/spu'
import { ref } from 'vue'

let $emit = defineEmits(['changeScene'])

//点击取消按钮：通知父组件切换场景1,展示已有SPU数据
const cancel = () => {
  $emit('changeScene', 0)
}
// 存储已有的SPU这些数据
let AllTradeMark = ref<Trademark[]>([])
// 商品图片
let imgList = ref<SpuImg[]>([])
// 已有的SPU的销售属性
let saleAttr = ref<SaleAttr[]>([])
//获取全部
let allSaleAttr = ref<HasSaleAttr[]>([])
//子组件书写一个方法
const initHasSpuData = async (spu: SpuData) => {
  // spu:即为父组件传递过来的已有的SPU对象【不完整】
  //获取全部品牌数据
  let res: AllTradeMark = await reqAllTradeMark()
  //获取某一品牌下全部售卖商品图片
  let res1: SpuHasImg = await reqSpuImageList(spu.id as number)
  //获取已有的SPU销售属性数据
  let res2: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id as number)
  //获取整个项目全部SPU的销售属性
  let res3: HasSaleAttrResponseData = await reqAllSalAttr()
  AllTradeMark.value = res.data
  imgList.value = res1.data
  saleAttr.value = res2.data
  allSaleAttr.value = res3.data
}
//对外暴露
defineExpose({ initHasSpuData })
</script>

<style scoped></style>
