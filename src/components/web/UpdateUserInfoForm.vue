<template>
  <a-skeleton active :loading="loadingGetUserInfo">
    <a-form
        :label-col="{ span: 4 }"
        :model="updateUserInfoState"
        :rules="rules"
        :wrapper-col="{ span: 18 }"
    >
      <a-form-item label="姓名" name="username">
        <a-input v-model:value="updateUserInfoState.username" />
      </a-form-item>
      <a-form-item label="学号" name="userNum">
        <a-input v-model:value="updateUserInfoState.userNum" />
      </a-form-item>
      <a-form-item label="邮箱" name="email">
        <a-input v-model:value="updateUserInfoState.email" />
      </a-form-item>
      <template v-if="dataGetUserInfo?.email!==updateUserInfoState.email">
        <a-form-item label="验证码" name="verCode">
          <a-input-search
              v-model:value="updateUserInfoState.verCode">
<!--              @search="handleSendMail"-->
<!--          >-->
<!--            <template #enterButton>-->
<!--              <a-button :disabled="disabledSendMail" type="primary">-->
<!--                {{ sendMailBtuText }}-->
<!--              </a-button>-->
<!--            </template>-->
          </a-input-search>
        </a-form-item>
      </template>
      <a-form-item label="学院" name="school">
        <a-input v-model:value="updateUserInfoState.school" />
      </a-form-item>
      <a-form-item label="专业" name="major">
        <a-input v-model:value="updateUserInfoState.major" />
      </a-form-item>
      <a-form-item label="性别" name="gender">
        <a-radio-group
            v-model:value="updateUserInfoState.gender"
            :options="genderRadioOption"
        />
      </a-form-item>
      <a-form-item label="单位" name="organization">
        <a-input v-model:value="updateUserInfoState.organization" />
      </a-form-item>
      <a-form-item label="旧密码" name="oldPassword">
        <a-input-password
            v-model:value="updateUserInfoState.oldPassword"
            placeholder="当需要修改密码时需要验证新密码"
            autocomplete="off"
        />
      </a-form-item>
      <a-form-item label="新密码" name="newPassword">
        <a-input-password
            v-model:value="updateUserInfoState.password"
            :disabled="updateUserInfoState.oldPassword === ''"
            placeholder="输入新密码"
            autocomplete="off"
        />
      </a-form-item>
      <a-form-item label="重复新密码" name="repeatPassword">
        <a-input-password
            v-model:value="repeatPassword"
            :disabled="updateUserInfoState.oldPassword === ''"
            placeholder="确认新密码"
            autocomplete="off"
        />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-space>
          <a-button type="primary" @click="handleUpdateUserInfo" :loading="loadingUpdateUserInfo">修改</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </a-skeleton>
</template>

<script lang="ts" setup>

import { useStore } from '../../store'
import { useRequest } from 'vue-request'
import { apiGetUserInfo, apiUpdateUserInfo } from '../../api/web/user'
import { RuleObject, StoreValue } from 'ant-design-vue/es/form/interface'
import { reactive, ref } from 'vue'
import { updateUserInfoReq } from '../../api/web/model/userModel'
import { radioOption } from '../../api/common'
import {useForm} from "ant-design-vue/es/form";
import {message} from "ant-design-vue";

// eslint-disable-next-line no-undef
const emits = defineEmits<{
  (e: 'finish', refresh: boolean): void
}>()

// 性别多选框
const genderRadioOption: radioOption[] = [
  {
    value: 1,
    label: '男'
  },
  {
    value: 2,
    label: '女'
  }
]

// 更新用户数据
const updateUserInfoState = reactive<updateUserInfoReq>({
  username: '',
  userNum: '',
  email: '',
  verCode: '',
  gender: 0,
  school: '',
  avatarImg: '',
  grade: 0,
  major: '',
  oldPassword: '',
  password: '',
  organization: ''
})

const repeatPassword = ref<string>('')

// 获取自己的详细信息
const {
  data: dataGetUserInfo,
  loading: loadingGetUserInfo,
} = useRequest(apiGetUserInfo, {
  manual: false,
  formatResult: (res) => {
    return res.data.result
  },
  onSuccess: (res) => {
    updateUserInfoState.username = res.username
    updateUserInfoState.userNum = res.userNum
    updateUserInfoState.email = res.email
    updateUserInfoState.gender = res.gender
    updateUserInfoState.school = res.school
    updateUserInfoState.avatarImg = res.avatarImg
    updateUserInfoState.grade = res.grade
    updateUserInfoState.major = res.major
    updateUserInfoState.organization = res.organization
    updateUserInfoState.major = res.major
  }
})

const rules = reactive<Record<string, RuleObject[]>>({
  username: [{ required: true, message: '姓名不能为空' }],
  userNum: [
    { required: true, message: '学号不能为空' },
    {
      pattern: /^[0-9]*$/,
      message: '学号需为数字'
    }
  ],
  email: [
    { required: true, message: '邮箱不能为空' },
    {
      pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
      message: '需满足邮箱格式'
    }
  ],
  major: [{ required: true, message: '专业不能为空' }],
  school: [{ required: true, message: '学院不能为空' }],
  organization: [{ required: true, message: '单位不能为空' }],
  verCode: [
    { pattern: /^\d{6}$/, message: '验证码为6为纯数字' },
    {
      validator: (rule: RuleObject, value: string) => {
        if (
          updateUserInfoState.email !== dataGetUserInfo.value?.email &&
            value === ''
        ) {
          return Promise.reject(new Error('重置邮箱需要验证码'))
        }
        return Promise.resolve()
      }
    }
  ],
  newPassword: [
    {
      pattern: /^[a-zA-Z]\w{5,17}$/,
      message: '长度在6~18之间，只能包含字母、数字和下划线'
    }
  ],
  repeatPassword: [
    {
      validator: (_rule: RuleObject, _value: string) => {
        if (repeatPassword.value !== updateUserInfoState.password) {
          return Promise.reject(new Error('两次输入的密码不一致'))
        }
        return Promise.resolve()
      }
    }
  ]
})

const { run: runUpdateUserInfo, loading: loadingUpdateUserInfo, error: errUpdateUserInfo } =
    useRequest(apiUpdateUserInfo)

// 校验规则
const { validate } = useForm(updateUserInfoState, rules)

// 更新数据
const handleUpdateUserInfo = async() => {
  try {
    validate()
  } catch (err) {
    message.error('输入数据不满足提交要求')
    return
  }
  await runUpdateUserInfo(updateUserInfoState)
  if (errUpdateUserInfo.value) {
    return
  }
  emits('finish',true)
}

</script>

<style scoped>

</style>
