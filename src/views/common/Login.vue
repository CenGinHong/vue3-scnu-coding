<template>
  <div :class="style.outer">
    <div :class="style.loginLogo">
      <img alt src="/src/assets/logo.gif" />
      <h1>SCNU-CODING</h1>
    </div>
    <a-form
      :class="style.form"
      :model="loginState"
      :rules="rules"
      layout="horizontal"
    >
      <a-form-item name="userNum">
        <a-input
          v-model:value="loginState.userNum"
          placeholder="请输入学工号"
          size="large"
        >
          <template #prefix>
            <user-outlined />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item name="password">
        <a-input-password
          v-model:value="loginState.password"
          placeholder="请输入密码"
          size="large"
        >
          <template #prefix>
            <lock-outlined />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item>
        <a-button
          :loading="loadingLogin"
          block
          html-type="submit"
          size="large"
          type="primary"
          @click="handleLogin"
          >登录
        </a-button>
      </a-form-item>
      <a :class="style.forgetPassword" @click="handleRouterToForgetPassword"
        >忘记密码？</a
      >
    </a-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, useCssModule } from 'vue'
import { LockOutlined, UserOutlined } from '@ant-design/icons-vue'
import { useRequest } from 'vue-request'
import { apiLogin } from '../../api/web/user'
import { loginReq } from '../../api/web/model/userModel'
import { useStore } from '../../store'
import { useRoute, useRouter } from 'vue-router'
import { redirectToHomePage } from '../../router/routerGurad'
import { ROUTER_NAME } from '../../router'
import { RuleObject } from 'ant-design-vue/es/form/interface'

export default defineComponent({
  name: 'Login',
  components: {
    LockOutlined,
    UserOutlined
  },
  setup() {
    const style = useCssModule()
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const loginState = reactive<loginReq>({
      userNum: '',
      password: ''
    })

    const rules = {
      userNum: [
        { required: true, message: '学工号不能为空' },
        { pattern: /^[0-9]*$/, message: '学工号需为数字' }
      ]
    }

    const {
      data: dataLogin,
      run: runLogin,
      error: errLogin,
      loading: loadingLogin
    } = useRequest(apiLogin, {
      formatResult: (res) => {
        return res.data.result
      }
    })
    const handleLogin = async() => {
      await runLogin(loginState)
      if (errLogin.value) {
        return
      }
      // 存起来token
      store.commit('user/setToken', dataLogin.value!.token)
      store.dispatch('user/getUserInfo').then(() => {
        const to = redirectToHomePage()
        router.push(to)
        // console.log(123)
        // // 跳转到登陆前想要访问的页面
        // if (route.query?.redirect) {
        //   console.log(789)
        //   const toPath = decodeURIComponent(route.query!.redirect as string)
        //   router.replace(toPath)
        // } else {
        //   console.log(456)
        //   // 跳转到该身份首页
        //
        // }
      })
    }

    const handleRouterToForgetPassword = () => {
      router.push({
        name: ROUTER_NAME.FORGET_PASSWORD
      })
    }
    return {
      style,
      rules,
      loginState,
      handleLogin,
      loadingLogin,
      handleRouterToForgetPassword
    }
  }
})
</script>

<style lang="scss" module>
.outer {
  width: 100vw;
  height: 100vh;
  padding-top: 160px;
  background: url('/src/assets/login.svg');
  display: flex;
  flex-direction: column;
  align-items: center;
  .loginLogo {
    display: flex;
    margin-bottom: 30px;
    align-items: center;

    img {
      height: 64px;
    }

    h1 {
      margin-bottom: 0;
      margin-left: 10px;
    }
  }

  .form {
    text-align: left;
    .forgetPassword {
      float: right;
      margin-top: -15px;
    }
  }
}
</style>

<style lang="scss" scoped>
::v-deep(.ant-form) {
  width: 400px;

  .ant-col {
    width: 100%;
  }

  .ant-form-item-label {
    padding-right: 6px;
  }
}
</style>
