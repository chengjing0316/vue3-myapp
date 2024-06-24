<template>
  <div>
    <el-table
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      :data="PermissionArr"
    >
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="code" label="权限值" />
      <el-table-column
        prop="updateTime"
        label="修改时间"
        show-overflow-tooltip
      />
      <el-table-column label="操作" width="260px">
        <template #="{ row, $index }">
          <el-button
            size="small"
            @click="addPermission(row)"
            type="primary"
            :disabled="row.level === 4 ? true : false"
          >
            {{ row.level == 3 ? '添加功能' : '添加菜单' }}
          </el-button>
          <el-button
            size="small"
            @click="updatePermission(row)"
            type="primary"
            :disabled="row.level == 1 ? true : false"
          >
            编辑
          </el-button>
          <el-popconfirm
            width="260px"
            :title="`你确定要删除${row.name}?`"
            @confirm="removeMenu(row.id)"
          >
            <template #reference>
              <el-button
                size="small"
                @click=""
                :disabled="row.level === 1 ? true : false"
                type="danger"
              >
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框组件：添加或更新已有菜单 -->
    <el-dialog
      v-model="dialogVisible"
      :title="menuData.id ? '更新菜单' : '添加菜单'"
    >
      <el-form>
        <el-form-item label="名称">
          <el-input
            placeholder="请你输入菜单的名称"
            v-model="menuData.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <el-input
            placeholder="请你输入权限数值"
            v-model="menuData.code"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import {
  reqAllPermission,
  reqAddOrUpdateMenu,
  reqRemoveMenu
} from '@/api/acl/menu'
import type {
  PermissionResponseData,
  PermissionList,
  Permission,
  MenuParams
} from '@/api/acl/menu/type'
import { ElMessage } from 'element-plus'

let PermissionArr = ref<PermissionList>([])
let dialogVisible = ref<boolean>(false)
let menuData = reactive<MenuParams>({
  code: '',
  level: 0,
  name: '',
  pid: 0
})
//获取菜单数据
const getHasPermission = async () => {
  let res: PermissionResponseData = await reqAllPermission()
  if (res.code == 200) {
    PermissionArr.value = res.data
  }
}
//添加菜单按钮的回调
const addPermission = (row: Permission) => {
  //添加前清空数据
  Object.assign(menuData, {
    id: 0,
    code: '',
    level: 0,
    name: '',
    pid: 0
  })
  dialogVisible.value = true
  //收集新增的菜单的level数值
  menuData.level = row.level + 1
  //给谁新增子菜单
  menuData.pid = row.id as number
}
//编辑已有菜单
const updatePermission = (row: Permission) => {
  dialogVisible.value = true
  Object.assign(menuData, row)
}
const save = async () => {
  //发请求
  let res = await reqAddOrUpdateMenu(menuData)
  if (res.code == 200) {
    dialogVisible.value = false
    ElMessage({
      type: 'success',
      message: menuData.id ? '更新成功' : '添加成功'
    })
    getHasPermission()
  }
}
//删除菜单
const removeMenu = async (id: number) => {
  let res = await reqRemoveMenu(id)
  if (res.code === 200) {
    ElMessage({ type: 'success', message: '删除成功' })
  }
}
onMounted(() => {
  getHasPermission()
})
</script>

<style scoped lang="scss"></style>
