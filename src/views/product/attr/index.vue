<template>
  <div>
    <!-- 三级分类全局组件 -->
    <Category :scene="scene"></Category>
    <el-card style="margin:10px 0px">
      <div v-show="scene == 0">
        <el-button type="primary" icon="Plus" size="default" :disabled="categoryStore.c3Id ? false : true"
          @click="addAttr">添加属性</el-button>
        <el-table border style="margin: 10px 0px;" :data="attrArr">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="属性名称" align="center" width="120px" prop="attrName"></el-table-column>
          <el-table-column label="属性值名称" align="center">
            <template #default="scope">
              <el-tag style="margin: 5px;" v-for="(item, index) in scope.row.attrValueList" :key="item.id">{{
        item.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="220px">
            <template #default="scope">
              <el-button size="small" type="primary" icon="Edit" @click="updateAttr">编辑</el-button>
              <el-button size="small" type="danger" icon="Delete">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="scene == 1">
        <!-- 展示添加属性与修改数据的结构 -->
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input placeholder="请你输入属性名称"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" size="default" icon="Plus">添加属性值</el-button>
        <el-button type="primary" size="default" @click="cancel">取消</el-button>
        <el-table border style="margin: 10px 0;">
          <el-table-column label="序号" width="80px" type="index" align="center"></el-table-column>
          <el-table-column label="属性值名称"></el-table-column>
          <el-table-column label="属性值操作"></el-table-column>
        </el-table>
        <el-button type="primary" size="default">保存</el-button>
        <el-button type="primary" size="default" @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch,reactive } from 'vue';
  //引入获取以邮件属性值接口
  import { reqAttr } from '@/api/product/attr'
  //获取分类的仓库
  import useCategoryStore from '@/store/modules/category';
  import type { AttrResponseData, Attr } from '@/api/product/attr/type';

  let categoryStore = useCategoryStore()
  //存储已有的属性与属性值
  let attrArr = ref<Attr[]>([])

  //定义card组件内容切换变量
  let scene = ref<number>(0) //0:显示table,1显示添加与修改属性结构
  //收集新增属性的数据
  let attrParams = reactive<Attr>({
    attrName:'', //新增的属性的名字
    attrValueList:[],//新增的属性值数组
    categoryId:'',  //三级分类的ID
    categoryLevel:3 //代表三级分类
  })
  //监听仓库三级分类ID变化
  watch(() => categoryStore.c3Id, () => {
    //清空上一次查询的数据
    attrArr.value = []
    //保证三级分类得有才能发请求
    if (!categoryStore.c3Id) return
    //获取分类ID
    getAttr()
  })
  //获取已有的属性与属性值方法
  const getAttr = async () => {
    const { c1Id, c2Id, c3Id } = categoryStore
    let result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
    if (result.code == 200) {
      attrArr.value = result.data
    }
  }
  //添加属性按钮的回调
  const addAttr = () => {
    //切换为添加与修改属性的结构
    scene.value = 1
  }

  //table表格修改已有属性按钮的回调
  const updateAttr = () => {
    //切换为添加与修改属性的结构
    scene.value = 1
  }

  //取消按钮回调
  const cancel = () => {
    scene.value = 0
  }
</script>

<style scoped lang="scss"></style>
