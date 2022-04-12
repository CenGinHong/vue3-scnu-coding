<template>
  <div class="outer">
    <a-form class="form" :model="resetPasswordState" :rules="rules">
      <a-form-item name="userNum">
        <a-input
            v-model:value="resetPasswordState.userNum"
            placeholder="请输入学工号"
        >
          <template #prefix>
            <user-outlined/>
          </template>
        </a-input>
      </a-form-item>
      <a-form-item name="email">
        <a-input
            v-model:value="resetPasswordState.email"
            placeholder="请输入邮箱"
        >
          <template #prefix>
            <mail-outlined/>
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
            <verified-outlined/>
          </template>
          <template #enterButton>
            <a-button :disabled="disabledSendMail" type="primary"
            >{{ sendMailBtuText }}
            </a-button>
          </template>
        </a-input-search>
      </a-form-item>
      <a-form-item name="newPassword">
        <a-input-password
            v-model:value="resetPasswordState.newPassword"
            placeholder="请输入新密码"
            autocomplete="off"
        >
          <template #prefix>
            <lock-outlined/>
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item name="repeatPassword">
        <a-input-password
            v-model:value="repeatPassword"
            :disabled="resetPasswordState.newPassword === ''"
            autocomplete="off"
            placeholder="请确认新密码"
        >
          <template #prefix>
            <lock-outlined/>
          </template>
        </a-input-password>
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
      <a class="backToLogin" @click="handleRouterToLogin">返回登录页</a>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
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
import { useForm } from 'ant-design-vue/es/form'
import { message } from 'ant-design-vue'

const router = useRouter()

const repeatPassword = ref<string>('')

const resetPasswordState = reactive<resetPasswordReq>({
  userNum: '',
  email: '',
  verCode: '',
  newPassword: ''
})

const sendMailBtuText = ref<string>('获取验证码')
const disabledSendMail = ref<boolean>(false)

// 发送邮件冷却
let timer: any
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

// 返回登录页
const handleRouterToLogin = () => {
  router.push({
    name: ROUTER_NAME.LOGIN
  })
}

// 表单校验规则
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
      validator: (_rule:RuleObject, _value: string) => {
        if (repeatPassword.value !== resetPasswordState.newPassword) {
          return Promise.reject(new Error('密码不一致'))
        }
        return Promise.resolve()
      }
    }
  ]
})

// 校验规则
const { validate } = useForm(resetPasswordState, rules)

const {
  run: runResetPassword,
  error: errorResetPassword,
  loading: loadingResetPassword
} = useRequest(apiResetPassword)
const handleResetPassword = async() => {
  try {
    await validate()
  } catch (err) {
    message.error('输入数据不满足提交要求')
    return
  }
  await runResetPassword(resetPasswordState)
}
</script>

<style lang="scss" scoped>
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
