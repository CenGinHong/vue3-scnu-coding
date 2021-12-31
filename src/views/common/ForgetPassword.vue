<template>
  <div :class="style.outer">
    <a-form :class="style.form" :model="resetPasswordState" :rules="rules">
      <a-form-item name="userNum">
        <a-input
          v-model:value="resetPasswordState.userNum"
          placeholder="请输入学工号"
        >
          <template #prefix>
            <user-outlined />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item name="email">
        <a-input
          v-model:value="resetPasswordState.email"
          placeholder="请输入邮箱"
        >
          <template #prefix>
            <mail-outlined />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item name="verCode">
        <a-input-search
          v-model:value="resetPasswordState.verCode"
          name="verCode"
          placeholder="请输入验证码"
          @search="handleSendMail"
        >
          <template #prefix>
            <verified-outlined />
          </template>
          <template #enterButton>
            <a-button :disabled="disabledSendMail" type="primary"
              >{{ sendMailBtuText }}
            </a-button>
          </template>
        </a-input-search>
      </a-form-item>
      <a-form-item name="newPassword">
        <a-input
          v-model:value="resetPasswordState.newPassword"
          placeholder="请输入新密码"
        >
          <template #prefix>
            <lock-outlined />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item name="repeatPassword">
        <a-input
          v-model:value="resetPasswordState.repeatPassword"
          name="userNum"
          placeholder="请确认新密码"
        >
          <template #prefix>
            <lock-outlined />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button
          :loading="loadingResetPassword"
          block
          size="large"
          type="primary"
          @click="handleResetPassword"
        >
          重置密码
        </a-button>
      </a-form-item>
      <a :class="style.backToLogin" @click="handleRouterToLogin">返回登录页</a>
    </a-form>
  </div>
</template>

<script lang="ts">
import {
  LockOutlined,
  MailOutlined,
  UserOutlined,
  VerifiedOutlined
} from '@ant-design/icons-vue'
import { defineComponent, reactive, ref, useCssModule } from 'vue'
import { resetPasswordReq } from '../../api/web/model/userModel'
import { RuleObject } from 'ant-design-vue/es/form/interface'
import { useRequest } from 'vue-request'
import { apiResetPassword } from '../../api/web/user'
import { useRouter } from 'vue-router'
import { ROUTER_NAME } from '../../router'

interface resetPasswordState extends resetPasswordReq {
  repeatPassword: string
}

export default defineComponent({
  name: 'ForgetPassWord',
  components: {
    UserOutlined,
    MailOutlined,
    VerifiedOutlined,
    LockOutlined
  },
  setup() {
    const router = useRouter()
    const resetPasswordState = reactive<resetPasswordState>({
      userNum: '',
      email: '',
      verCode: '',
      newPassword: '',
      repeatPassword: ''
    })
    const sendMailBtuText = ref<string>('获取验证码')
    const disabledSendMail = ref<boolean>(false)
    let timer
    const handleSendMail = () => {
      const TIME_COUNT = 60
      if (!timer) {
        disabledSendMail.value = true
        let count = TIME_COUNT
        timer = setInterval(() => {
          if (count > 0 && count <= TIME_COUNT) {
            count--
            sendMailBtuText.value = String(count) + 's后可重发'
          } else {
            clearInterval(timer)
            timer = null
            sendMailBtuText.value = '获取验证码'
            disabledSendMail.value = false
          }
        }, 1000)
      }
    }

    const {
      run: runResetPassword,
      error: errorResetPassword,
      loading: loadingResetPassword
    } = useRequest(apiResetPassword)
    const handleResetPassword = async() => {
      await runResetPassword(resetPasswordState)
    }

    const handleRouterToLogin = () => {
      router.push({
        name: ROUTER_NAME.LOGIN
      })
    }

    const rules = reactive<Record<string, RuleObject[]>>({
      userNum: [
        { required: true, message: '学工号不能为空' },
        { pattern: /^[0-9]*$/, message: '学工号需为数字' }
      ],
      email: [
        { type: 'string', required: true, message: '邮箱不能为空' },
        {
          pattern: /w+([-+.]w+)*@w+([-.]w+)*.w+([-.]w+)*/,
          message: '邮箱不符合标准格式'
        }
      ],
      verCode: [
        { required: true, message: '验证码不能为空' },
        {
          pattern: /^\d{6}$/,
          message: '验证码需为6位数字'
        }
      ],
      newPassword: [
        { required: true, message: '新密码不能为空' },
        {
          pattern: /^[a-zA-Z]\w{5,17}$/,
          message: '以字母开头，长度在6~18之间，只能包含字母、数字和下划线'
        }
      ],
      repeatPassword: [
        {
          validator: (rule: RuleObject, value: string, cb: (Error) => any) => {
            if (value === '') {
              cb(Error('请确认密码'))
            }
            if (value !== resetPasswordState.newPassword) {
              cb(Error('两次输入的密码不一致'))
            }
          }
        }
      ]
    })
    const style = useCssModule()
    return {
      handleSendMail,
      handleResetPassword,
      handleRouterToLogin,
      rules,
      resetPasswordState,
      disabledSendMail,
      sendMailBtuText,
      loadingResetPassword,
      style
    }
  }
})
</script>

<style lang="scss" module>
.outer {
  width: 100vw;
  height: 100vh;
  padding-top: 120px;
  background: url('/src/assets/login.svg');
  display: flex;
  flex-direction: column;
  align-items: center;

  .form {
    width: 420px;
    padding: 16px;
    box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.25);
    border-radius: 10px;
    text-align: left;
    .backToLogin {
      float: right;
    }
  }
}
</style>
<style lang="scss" scoped>
::v-deep(.ant-input-group-addon) {
  padding: 0 0;
}
</style>
