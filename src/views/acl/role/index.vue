<template>
  <div>
    <!-- 搜索 -->
    <el-card style="height: 80px">
      <el-form :inline="true" class="form">
        <el-form-item label="职位搜索" size="default">
          <el-input placeholder="请你输入搜索职位" v-model="keyword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="default" @click="search">
            搜索
          </el-button>
          <el-button size="default" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 表格 -->
    <el-card style="margin: 10px 0">
      <el-button type="primary" size="default" @click="addRole" icon="Plus">
        添加职位
      </el-button>
      <el-table :data="allRole" border stripe style="margin: 10px 0">
        <el-table-column
          label="#"
          align="center"
          type="index"
        ></el-table-column>
        <el-table-column label="ID" align="center" prop="id"></el-table-column>
        <el-table-column
          label="职位名称"
          align="center"
          show-overflow-tooltip
          prop="roleName"
        ></el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          show-overflow-tooltip
          prop="createTime"
        ></el-table-column>
        <el-table-column
          label="更新时间"
          align="center"
          show-overflow-tooltip
          prop="updateTime"
        ></el-table-column>
        <el-table-column label="操作" width="300px" align="center">
          <template #="{ row, $index }">
            <el-button
              type="primary"
              size="small"
              @click="setPermission(row)"
              icon="User"
            >
              分配权限
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="updateRole(row)"
              icon="User"
            >
              编辑
            </el-button>
            <el-popconfirm
              :title="`你确定删除${row.roleName}`"
              width="260px"
              @confirm="removeRole(row.id)"
            >
              <template #reference>
                <el-button type="danger" size="small" icon="Delete">
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[5, 7, 9, 11]"
        :background="true"
        layout="prev, pager, next, jumper, -> , sizes, total"
        :total="total"
        @current-change="getHasRole"
        @size-change="sizeChange"
      />
    </el-card>
    <!-- 添加职位与更新 -->
    <el-dialog
      v-model="dialogVisible"
      :title="RoleParams.id ? '更新职位' : '添加职位'"
    >
      <el-form :model="RoleParams" :rules="rules" ref="form">
        <el-form-item label="职位名称" prop="roleName">
          <el-input
            placeholder="请你输入职位名称"
            v-model="RoleParams.roleName"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="default" @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" size="default" @click="save">确定</el-button>
      </template>
    </el-dialog>
    <!-- 抽屉组件：分配职位权限 -->
    <el-drawer v-model="drawer">
      <template #header>
        <h4>分配菜单与按钮权限</h4>
      </template>
      <template #default>
        <!-- 树形控件 -->
        <el-tree
          ref="tree"
          :data="menuArr"
          show-checkbox
          node-key="id"
          default-expand-all
          :props="defaultProps"
          :default-checked-keys="selectArr"
        ></el-tree>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer = false">取消</el-button>
          <el-button type="primary" @click="handler">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqRemoveRole,
  reqAllRoleList,
  reqAddOrUpdateRole,
  reqAllMenuList,
  reqSetPermission
} from '@/api/acl/role'
import type {
  RoleResponseData,
  Records,
  RoleData,
  MenuResponseData,
  MenuList
} from '@/api/acl/role/type'
import useLayOutSettingStore from '@/store/modules/setting'
import { ElMessage, resultProps } from 'element-plus'
let pageNo = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)
let settingStore = useLayOutSettingStore()
let dialogVisible = ref<boolean>(false)
let RoleParams = reactive<RoleData>({
  roleName: ''
})
let keyword = ref<string>('')
//存储全部职位
let allRole = ref<Records>([])
//获取form示例
let form = ref<any>()
//抽屉
let drawer = ref<boolean>(false)
//定义数组存储用户权限数据
let menuArr = ref<MenuList>([])
//用于存储勾选的节点的ID（四级的）
let selectArr = ref<number[]>([])
//获取tree实例
let tree = ref<any>()
//配置选项
const defaultProps = {
  children: 'children',
  label: 'name'
}
// 获取职位请求
const getHasRole = async (pager = 1) => {
  // 修改当前页码
  pageNo.value = pager
  let res: RoleResponseData = await reqAllRoleList(
    pageNo.value,
    pageSize.value,
    keyword.value
  )
  if (res.code === 200) {
    total.value = res.data.total
    allRole.value = res.data.records
  }
}
const sizeChange = () => {
  getHasRole()
}
const search = () => {
  // 根据关键字获取相应的数据
  getHasRole()
  //清空关键字
  keyword.value = ''
}
const reset = () => {
  settingStore.refresh = !settingStore.refresh
}
const validateRoleName = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('职位名称至少两位'))
  }
}
const rules = {
  roleName: [{ required: true, trigger: 'blur', validator: validateRoleName }]
}
const addRole = () => {
  dialogVisible.value = true
  Object.assign(RoleParams, {
    roleName: '',
    id: 0
  })
  //清空上次表单校验错误
  nextTick(() => {
    form.value.clearValidate('roleName')
  })
}
const updateRole = (row: RoleData) => {
  dialogVisible.value = true
  // 存储已有的职位
  Object.assign(RoleParams, row)
  nextTick(() => {
    form.value.clearValidate('roleName')
  })
}
const save = async () => {
  // 表单校验结果通过了再发请求
  await form.value.validate()
  let res: any = await reqAddOrUpdateRole(RoleParams)
  if (res.code === 200) {
    ElMessage({
      type: 'success',
      message: RoleParams.id ? '更新成功' : '添加成功'
    })
    dialogVisible.value = false
    getHasRole(RoleParams.id ? pageNo.value : 1)
  }
}
const setPermission = async (row: RoleData) => {
  //显示抽屉
  drawer.value = true
  // 收集职位数据
  Object.assign(RoleParams, row)
  //根据职位获取权限数据
  let res: MenuResponseData = await reqAllMenuList(RoleParams.id as number)
  if (res.code == 200) {
    menuArr.value = res.data
    selectArr.value = filterSelectArr(menuArr.value, [])
  }
}
//筛选勾选的ID
const filterSelectArr = (allData: any, initArr: any) => {
  allData.forEach((item: any) => {
    if (item.select && item.level == 4) {
      initArr.push(item.id)
    }
    if (item.children && item.children.length > 0) {
      filterSelectArr(item.children, initArr)
    }
  })
  return initArr
}
//抽屉确定按钮的回调
const handler = async () => {
  // 职位ID
  const roleId = RoleParams.id as number
  //选中节点的ID
  let arr = tree.value.getCheckedKeys()
  //半选的ID
  let arr1 = tree.value.getHalfCheckedKeys()
  let permissionId = arr.concat(arr1)
  //下发权限
  let res: any = await reqSetPermission(roleId, permissionId)
  if (res.code == 200) {
    drawer.value = false
    if (res.code === 200) {
      drawer.value = false
      ElMessage({
        type: 'success',
        message: '分配权限成功'
      })
      //页面刷新
      window.location.reload()
    }
  }
}
//删除已有职位
const removeRole = async (id: number) => {
  let res: any = await reqRemoveRole(id)
  if (res.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getHasRole(allRole.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}
onMounted(() => {
  //获取职位请求
  getHasRole()
})
</script>

<style scoped lang="scss">
.form {
  display: flex;
  justify-content: space-between;
}
</style>
