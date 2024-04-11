<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select
          :disabled="scene == 0 ? false : true"
          v-model="categoryStore.c1Id"
          style="width: 240px"
          @change="getC2()"
        >
          <!-- label即为展示数据 -->
          <el-option
            v-for="(c1, index) in categoryStore.c1Arr"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          :disabled="scene == 0 ? false : true"
          v-model="categoryStore.c2Id"
          style="width: 240px"
          @change="getC3()"
        >
          <el-option
            v-for="(c2, index) in categoryStore.c2Arr"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          :disabled="scene == 0 ? false : true"
          v-model="categoryStore.c3Id"
          style="width: 240px"
        >
          <el-option
            v-for="(c3, index) in categoryStore.c3Arr"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import useCategoryStore from '@/store/modules/category'

let categoryStore = useCategoryStore()
//分类全局组件挂载完毕，通知仓库发请求获取一级分类的数据
onMounted(() => {
  getC1()
})

//通知仓库获取一级分类的方法
const getC1 = () => {
  categoryStore.getC1()
}
//此方法即为一级分类下拉菜单的change事件（选中值的时候触发，保证一级分类ID有了）
const getC2 = () => {
  //需要将二级、三级分类的 数据清空
  categoryStore.c2Id = ''
  categoryStore.c3Arr = []
  categoryStore.c3Id = ''
  //通知仓库获取二级分类
  categoryStore.getC2()
}
const getC3 = () => {
  //清理三级分类的数据
  categoryStore.c3Id = ''
  //通知仓库获取二级分类
  categoryStore.getC3()
}

//接受父组件传递的scene
defineProps(['scene'])
</script>

<style lang="scss" scoped></style>
