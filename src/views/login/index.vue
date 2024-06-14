<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form
          class="login-form"
          :model="loginForm"
          :rules="rules"
          ref="loginForms"
        >
          <h1>hello</h1>
          <h2>welcome to aaaa</h2>
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              :prefix-icon="Lock"
              v-model="loginForm.password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loading"
              type="primary"
              size="default"
              class="login_btn"
              @click="login"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
//引入用户相关的小仓库
import useUserStore from '@/store/modules/user'
import { useRoute, useRouter } from 'vue-router'
import { ElNotification } from 'element-plus'
import { getTime } from '@/utils/time'

let useStore = useUserStore()
//获取el-form组件
let loginForms = ref()
//获取路由器
let $router = useRouter()
//获取路由对象
let $route = useRoute()
//定义变量控制loading按钮加载效果
let loading = ref(false)
//收集账号与密码的数据
let loginForm = reactive({ username: 'admin', password: '111111' })
//登录按钮回调
const login = async () => {
  //保证全部校验通过再发请求
  await loginForms.value.validate()
  //加载效果:
  loading.value = true
  //点击登录后干什么？
  //通知仓库发送登录请求
  //请求成功-》首页展示数据的地方
  //请求失败-》弹出登录失败信息
  try {
    //保证登录成功
    await useStore.userLogin(loginForm)
    //登录成功后编程式导航跳转到展示数据的首页
    //判断登录的时候，路由路径当中是否有query参数，有跳转到query参数地址，没有跳转
    let redirect: any = $route.query.redirect
    $router.push({ path: redirect || '/' })
    //登录成功提示信息
    ElNotification({
      type: 'success',
      message: '登录成功',
      title: `HI,${getTime()}好`
    })
    //登录成功加载效果也消失
    loading.value = false
  } catch (error) {
    //登录失败加载效果消息
    loading.value = false
    //登录失败的提示信息
    ElNotification({
      type: 'error',
      //这里类型提示,改成error as Error就OK了
      message: (error as Error).message
    })
  }
}
//自定义校验规则函数
const validatorUserName = (rule: any, value: any, callback: any) => {
  //rule:即为校验规则对象
  //value:表单元素文本内容
  //如果符合条件callBack放行，不符合就注入错误提示信心
  if (value.length >= 5) {
    callback()
  } else {
    callback(new Error('账号长度至少五位'))
  }
}
const validatorPassWord = (rule: any, value: any, callback: any) => {
  if (value.length >= 5) {
    callback()
  } else {
    callback(new Error('账号长度至少五位'))
  }
}
//定义表单校验需要配置的对象
const rules = {
  username: [{ trigger: 'change', validatorUserName }],
  password: [{ trigger: 'change', validatorPassWord }]
}
</script>

<style lang="scss" scoped>
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;

  .login-form {
    position: relative;
    width: 80%;
    top: 30vh;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    padding: 40px;

    h1 {
      color: #fff;
      font-size: 40px;
    }

    h2 {
      font-size: 20px;
      color: #fff;
      margin: 20px 0px;
    }

    .login_btn {
      width: 100%;
    }
  }
}
</style>
@/store/modules/user
