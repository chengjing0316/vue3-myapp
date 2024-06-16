<template>
  <el-card style="height: 80px">
    <el-from :inline="true" class="form">
      <el-form-item label="用户名：" size="normal">
        <el-input placeholder="请你输入搜索用户名" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="default"
          :disabled="keyword.length ? false : true"
          @click="search"
        >
          搜索
        </el-button>
        <el-button size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-from>
  </el-card>
  <el-card style="margin: 10px 0">
    <el-button type="primary" size="default" @click="">添加用户</el-button>
    <el-button type="primary" size="default" @click="">批量删除</el-button>
    <el-table style="margin: 10px 0" border :data="userArr">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column label="#" align="center" type="index"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column
        label="用户名字"
        align="center"
        prop="username"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="用户名称"
        align="center"
        prop="name"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="用户角色"
        align="center"
        prop="roleName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        prop="updateTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="操作" width="300px" align="center">
        <template #="{ row, $index }">
          <el-button type="primary" size="small" @click="" icon="User">
            分配角色
          </el-button>
          <el-button type="primary" size="small" @click="" icon="User">
            编辑
          </el-button>
          <el-button type="primary" size="small" @click="" icon="User">
            删除
          </el-button>
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
      @current-change="getHasUser"
      @size-change="handler"
    />
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqUserInfo,
  reqAddOrUpdateUser,
  reqAllRole,
  reqSetUserRole,
  reqRemoveUser,
  reqSelectUser
} from '@/api/acl/user'
import type {
  UserResponseData,
  Records,
  User,
  AllRoleResponseData,
  AllRole,
  SetRoleData
} from '@/api/acl/user/type'

let pageNo = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(0)
let keyword = ref<string>('')
//存储全部用户的数组
let userArr = ref<Records>([])
const getHasUser = async (pager = 1) => {
  pageNo.value = pager
  let res: UserResponseData = await reqUserInfo(
    pageNo.value,
    pageSize.value,
    keyword.value
  )
  if (res.code === 200) {
    total.value = res.data.total
    userArr.value = res.data.records
  }
}

const handler = () => {
  getHasUser()
}

const search = () => {
  getHasUser()
  keyword.value = ''
}
const reset = () => {
  // settingStore.refsh = !settingStore.refsh
}
onMounted(() => {
  getHasUser()
})
</script>

<style scoped lang="scss">
.form {
  display: flex;
  justify-content: space-between;
}
</style>
