<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input
        placeholder="请输入SPU名称"
        v-model="SpuParams.spuName"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌" style="width: 300px">
      <el-select v-model="SpuParams.tmId">
        <el-option
          v-for="item in AllTradeMark"
          :value="item.id"
          :label="item.tmName"
          :key="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input
        v-model="SpuParams.description"
        type="textarea"
        placeholder="请你输入SPU描述"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU图标">
      <el-upload
        v-model:file-list="imgList"
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :before-upload="handlerUpload"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img
          w-full
          :src="dialogImageUrl"
          alt="Preview Image"
          style="width: 100%; height: 100%"
        />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <!-- 展示销售属性的下拉菜单 -->
      <el-select
        v-model="saleAttrIdAndValueName"
        style="width: 240px"
        :placeholder="
          unSelectSaleAttr.length
            ? `还未选择${unSelectSaleAttr.length}个`
            : '暂无数据可选择'
        "
      >
        <el-option
          v-for="(item, index) in unSelectSaleAttr"
          :key="item.id"
          :label="item.name"
          :value="`${item.id}:${item.name}`"
        ></el-option>
      </el-select>
      <el-button
        :disabled="saleAttrIdAndValueName ? false : true"
        style="margin-left: 10px"
        type="primary"
        size="default"
        icon="Plus"
        @click="addSaleAttr"
      >
        添加属性值
      </el-button>
      <!-- table展示销售属性与属性值的地方 -->
      <el-table border style="margin: 10px 0" :data="saleAttr">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="80px"
        />
        <el-table-column label="销售属性名" width="120px" prop="saleAttrName" />
        <el-table-column label="销售属性值">
          <template #default="scope">
            <el-tag
              v-for="(item, index) in scope.row.spuSaleAttrValueList"
              :key="scope.row.id"
              class="mx-1"
              closable
              style="margin: 0 8px"
              @close="
                scope.row.spuSaleAttrValueList.splice(scope.row.$index, 1)
              "
            >
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-input
              v-model="scope.row.saleAttrValue"
              placeholder="请你输入属性值"
              size="small"
              style="width: 100px"
              v-if="scope.row.flag === true"
              @blur="toLook(scope.row)"
              :ref="(vc: any) => (inputArr[scope.$index] = vc)"
            ></el-input>
            <el-button
              v-else
              type="primary"
              size="small"
              icon="Plus"
              @click="toEdit(scope.row, scope.$index)"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template #="{ row, $index }">
            <el-button
              type="danger"
              size="small"
              icon="Delete"
              @click="saleAttr.splice($index, 1)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        size="default"
        @click="save"
        :disabled="saleAttr.length > 0 ? false : true"
      >
        保存
      </el-button>
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
import { computed, nextTick, ref } from 'vue'
import { ElMessage } from 'element-plus'

let $emit = defineEmits(['changeScene'])

//点击取消按钮：通知父组件切换场景1,展示已有SPU数据
const cancel = () => {
  $emit('changeScene', { flag: 0, params: 'update' })
}
//准备一个数组：将来存储对应的组件实例el-input
const inputArr = ref<any>([])
// 存储已有的SPU这些数据
let AllTradeMark = ref<Trademark[]>([])
// 商品图片
let imgList = ref<SpuImg[]>([])
// 已有的SPU的销售属性
let saleAttr = ref<SaleAttr[]>([])
//全部销售属性
let allSaleAttr = ref<HasSaleAttr[]>([])
//控制对话框的显示与隐藏
let dialogVisible = ref<boolean>(false)
//存储已有的SPU对象
let SpuParams = ref<SpuData>({
  category3Id: '',
  spuName: '',
  description: '',
  tmId: '',
  spuImageList: [],
  spuSaleAttrList: [],
})
//存储预览图片地址
let dialogImageUrl = ref<string>('')
//将来收集还未选择的销售属性的ID与属性值的名字
let saleAttrIdAndValueName = ref<string>('')
//子组件书写一个方法
const initHasSpuData = async (spu: SpuData) => {
  //存储已有的SPU对象，将来在模板中展示
  SpuParams.value = spu
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
  imgList.value = res1.data.map((item) => {
    return {
      name: item.imgName,
      url: item.imgUrl,
    }
  })
  saleAttr.value = res2.data
  allSaleAttr.value = res3.data
}
//照片墙点击预览按钮时候触发的钩子
const handlePictureCardPreview = (file: any) => {
  dialogImageUrl.value = file.url
  //对话框弹出来
  dialogVisible.value = true
}
const handleRemove = () => {
  console.log(123)
}
const handlerUpload = (file: any) => {
  if (
    file.type === 'image/png' ||
    file.type === 'image/jpeg' ||
    file.type === 'image/gif'
  ) {
    if (file.size / 1024 / 1024 < 3) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件务必小于3M',
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传文件务必PNG|JPG|GIF',
    })
    return false
  }
}
//计算出当前SPU未拥有的属性
let unSelectSaleAttr = computed(() => {
  let unSelectAttr = allSaleAttr.value.filter((item) => {
    return saleAttr.value.every((item1) => {
      return item.name != item1.saleAttrName
    })
  })
  return unSelectAttr
})
//添加销售属性的方法
const addSaleAttr = () => {
  const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':')
  // 准备一个新的销售属性对象：将来带给服务器
  let newSaleAttr: SaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: [],
  }
  // 追加到数组当中
  saleAttr.value.push(newSaleAttr)
  // 清空收集的数据
  saleAttrIdAndValueName.value = ''
}
// 属性值按钮的点击事件
const toEdit = (row: SaleAttr, $index: number) => {
  //点击按钮时inmput组件出现
  row.flag = true
  row.saleAttrValue = ''
  nextTick(() => {
    inputArr.value[$index].focus()
  })
}
// 表单元素失去焦点的回调
const toLook = (row: SaleAttr) => {
  const { baseSaleAttrId, saleAttrValue } = row
  // 整理成服务器需要形式
  let newSaleAttrValue: SaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue as string,
  }
  // 非法情况判断
  if ((saleAttrValue as string).trim() == '') {
    ElMessage({
      type: 'error',
      message: '属性值不能为空的',
    })
    return
  }
  // 判断属性值是否重复
  let repeat = row.spuSaleAttrValueList.find((item) => {
    return item.saleAttrValueName == saleAttrValue
  })
  if (repeat) {
    ElMessage({
      type: 'error',
      message: '属性值重复',
    })
    return
  }
  // 追加新的属性值对象
  row.spuSaleAttrValueList.push(newSaleAttrValue)
  row.flag = false
}
//保存按钮的回调
const save = async () => {
  // 1、整理照片墙的数据
  SpuParams.value.spuImageList = imgList.value.map((item: any) => {
    return {
      imgName: item.name,
      imgUrl: (item.response && item.response.data) || item.url,
    }
  })
  // 2、整理销售属性的数据
  SpuParams.value.spuSaleAttrList = saleAttr.value
  let res = await reqAddOrUpdateSpu(SpuParams.value)
  if (res.code === 200) {
    ElMessage({
      type: 'success',
      message: SpuParams.value.id ? '更新成功' : '添加成功',
    })
    $emit('changeScene', {
      flag: 0,
      params: SpuParams.value.id ? 'update' : 'add',
    })
  }
}
//添加一个新的SPU初始化请求方法
const initAddSpu = async (c3Id: number | string) => {
  // 清空数据
  Object.assign(SpuParams.value, {
    category3Id: '',
    spuName: '',
    description: '',
    tmId: '',
    spuImageList: [],
    spuSaleAttrList: [],
  })
  //清空照片
  imgList.value = []
  // 清空销售属性
  saleAttr.value = []
  saleAttrIdAndValueName.value = ''
  // 存储三级分类的ID
  SpuParams.value.category3Id = c3Id
  // 获取全部品牌数据
  let result: AllTradeMark = await reqAllTradeMark()
  let result1: HasSaleAttrResponseData = await reqAllSalAttr()
  // 存储数据
  AllTradeMark.value = result.data
  allSaleAttr.value = result1.data
}
//对外暴露
defineExpose({ initHasSpuData, initAddSpu })
</script>

<style scoped></style>
