<template>
  <div>
    <el-card style="height: 80px">
      <el-form :inline="true" class="form">
        <el-form-item label="用户名：" size="default">
          <el-input
            placeholder="请你输入搜索用户名"
            v-model="keyword"
          ></el-input>
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
      </el-form>
    </el-card>
    <el-card style="margin: 10px 0">
      <el-button type="primary" size="default" @click="addUser">
        添加用户
      </el-button>
      <el-button
        type="primary"
        size="default"
        @click="deleteSelectUser"
        :disabled="selectIdArr.length ? false : true"
      >
        批量删除
      </el-button>
      <!-- table展示用户信息 -->
      <el-table
        @selection-change="selectChange"
        style="margin: 10px 0"
        border
        :data="userArr"
      >
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column
          label="#"
          align="center"
          type="index"
        ></el-table-column>
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
            <el-button
              type="primary"
              size="small"
              @click="setRole(row)"
              icon="User"
            >
              分配角色
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="updateUser(row)"
              icon="User"
            >
              编辑
            </el-button>
            <el-popconfirm
              :title="`你确定删除${row.username}`"
              width="260px"
              @confirm="deleteUser(row.id)"
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
      <!-- 分页器 -->
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
    <!-- 完成添加修改的抽屉结构 -->
    <el-drawer v-model="drawer">
      <template #header>
        <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
      </template>
      <template #default>
        <el-form :model="userParams" :rules="rules" ref="formRef">
          <el-form-item label="用户姓名" prop="username">
            <el-input
              placeholder="请您输入用户姓名"
              v-model="userParams.username"
            />
          </el-form-item>
          <el-form-item label="用户昵称" prop="name">
            <el-input
              placeholder="请您输入用户昵称"
              v-model="userParams.name"
            />
          </el-form-item>
          <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
            <el-input
              placeholder="请您输入用户密码"
              v-model="userParams.password"
            />
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </div>
      </template>
    </el-drawer>
    <!-- 职位分配 -->
    <el-drawer v-model="drawer1">
      <template #header>
        <h4>分配角色</h4>
      </template>
      <template #default>
        <el-form>
          <el-form-item label="用户姓名">
            <el-input v-model="userParams.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="职位列表">
            <el-checkbox
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
            >
              全选
            </el-checkbox>
            <!-- 显示职位的复选框 -->
            <el-checkbox-group
              v-model="userRole"
              @change="handleCheckedUsersChange"
            >
              <el-checkbox
                v-for="(role, index) in allRole"
                :key="index"
                :value="role"
              >
                {{ role.roleName }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer1 = false">取消</el-button>
          <el-button type="primary" @click="confirmClick">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
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
import { ElMessage } from 'element-plus'
import useLayOutSettingStore from '@/store/modules/setting'

let pageNo = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(0)
let keyword = ref<string>('')
//存储全部用户的数组
let userArr = ref<Records>([])
//定义响应式数据控制抽屉的显示与隐藏
let drawer = ref<boolean>(false)
//角色分配抽屉的显示与隐藏
let drawer1 = ref<boolean>(false)
// 全选复选框是否全选
const checkAll = ref<boolean>(false)
//不确定样式
const isIndeterminate = ref<boolean>(true)
//所有职位
let allRole = ref<AllRole>([])
//已有职位
let userRole = ref<AllRole>([])
//存储批量选中的用户
let selectIdArr = ref<User[]>([])
//获取模板setting仓库对象
let settingStore = useLayOutSettingStore()
//收集用户信息的响应式数据
let userParams = reactive<User>({
  username: '',
  name: '',
  password: ''
})
let formRef = ref<any>()
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
  // 根据关键字获取相应的数据
  getHasUser()
  //清空关键字
  keyword.value = ''
}
const reset = () => {
  settingStore.refresh = !settingStore.refresh
}
//添加用户按钮回调
const addUser = () => {
  drawer.value = true
  //清空数据
  Object.assign(userParams, { id: 0, username: '', name: '', password: '' })
  //清除上一次错误的提示信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('password')
  })
}
//更新已有的用户按钮回调
const updateUser = (row: User) => {
  drawer.value = true
  Object.assign(userParams, row)
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
  })
}
//保存按钮的回调
const save = async () => {
  formRef.value.validate()
  let res: any = await reqAddOrUpdateUser(userParams)
  if (res.code === 200) {
    drawer.value = false
    ElMessage({
      type: 'success',
      message: userParams.id ? '更新成功' : '添加成功'
    })
    window.location.reload()
  } else {
    drawer.value = false
    ElMessage({
      type: 'error',
      message: userParams.id ? '更新失败' : '添加失败'
    })
  }
}
//取消按钮
const cancel = () => {
  drawer.value = false
}
//用户名校验回调函数
const validatorUserName = (rule: any, value: any, callBack: any) => {
  //长度至少五位
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户名字至少五位'))
  }
}
//昵称校验
const validatorName = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户昵称至少五位'))
  }
}
//密码校验
const validatorPassword = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户密码至少六位'))
  }
}
//表单校验规则对象
const rules = {
  username: [{ required: true, trigger: 'blur', validator: validatorUserName }],
  name: [{ required: true, trigger: 'blur', validator: validatorName }],
  password: [{ required: true, trigger: 'blur', validator: validatorPassword }]
}
//删除角色
const deleteUser = async (userId: number) => {
  let res: any = await reqRemoveUser(userId)
  if (res.code === 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}
//分配角色抽屉
const setRole = async (row: User) => {
  drawer1.value = true
  // 存储已有用户信息
  Object.assign(userParams, row)
  //发请求获取全部的职位数据
  let result: AllRoleResponseData = await reqAllRole(userParams.id as number)
  if (result.code == 200) {
    //存储全部职位
    allRole.value = result.data.allRolesList
    //存储当前用户已有职位
    userRole.value = result.data.assignRoles
    //抽屉显示
    drawer1.value = true
  }
}
//全选复选框的change事件
const handleCheckAllChange = (val: boolean) => {
  userRole.value = val ? allRole.value : []
  isIndeterminate.value = false
}
//底部复选框change事件
const handleCheckedUsersChange = (value: string[]) => {
  let checkedCount = value.length
  checkAll.value = checkedCount === allRole.value.length
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < allRole.value.length
}
//确定按钮的回调
const confirmClick = async () => {
  //收集参数
  let data: SetRoleData = {
    userId: userParams.id as number,
    roleIdList: userRole.value.map((item) => {
      return item.id as number
    })
  }
  // 分配用户职位
  let res: any = await reqSetUserRole(data)
  if (res.code === 200) {
    ElMessage({
      type: 'success',
      message: '分配职务成功'
    })
    drawer1.value = false
    getHasUser(pageNo.value)
  }
}
//table复选框勾选的时候出发的事件
const selectChange = (val: any) => {
  selectIdArr.value = val
}
//批量删除的回调
const deleteSelectUser = async () => {
  //整理批量删除的参数
  let idList: any = selectIdArr.value.map((item) => {
    return item.id
  })
  //批量删除请求
  let res: any = await reqSelectUser(idList)
  if (res.code === 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
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
