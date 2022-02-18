<template>
  <a-skeleton active :loading="loadingGetDataUser">
    <a-form
        :label-col="{ span: 4 }"
        :model="updateUserState"
        :rules="rules"
        :wrapper-col="{ span: 18 }"
    >
      <a-form-item label="姓名" name="username">
        <a-input v-model:value="updateUserState.username"/>
      </a-form-item>
      <a-form-item label="学号" name="userNum">
        <a-input v-model:value="updateUserState.userNum"/>
      </a-form-item>
      <a-form-item label="邮箱" name="email">
        <a-input v-model:value="updateUserState.email"/>
      </a-form-item>
      <a-form-item label="学院" name="school">
        <a-input v-model:value="updateUserState.school"/>
      </a-form-item>
      <a-form-item label="专业" name="major">
        <a-input v-model:value="updateUserState.major"/>
      </a-form-item>
      <a-form-item label="性别" name="gender">
        <a-radio-group
            v-model:value="updateUserState.gender"
            :options="genderRadioOption"
        />
      </a-form-item>
      <a-form-item label="单位" name="organization">
        <a-input v-model:value="updateUserState.organization"/>
      </a-form-item>
      <a-form-item label="年级" name="organization">
        <a-date-picker v-model:value="updateUserState.grade" picker="year"/>
      </a-form-item>
      <a-form-item label="创建时间" name="创建时间">
        {{ updateUserState.createdAt }}
      </a-form-item>
      <a-form-item label="修改时间" name="updatedAt">
        {{ updateUserState.updatedAt }}
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-space>
          <a-popconfirm title="确认修改？" @confirm="handleUpdateUserInfo">
            <a-button type="primary" :loading="loadingUpdateUser">
              <edit-outlined/>
              修改
            </a-button>
          </a-popconfirm>
          <a-popconfirm title="密码将设为与学工号一致，确认重置密码？"
                        @confirm="handleResetPassword">
            <a-button :loading="loadingResetPassword">
              <reload-outlined/>
              重置密码
            </a-button>
          </a-popconfirm>
          <a-popconfirm title="删除用户将不可恢复，确认删除？"
                        @confirm="handleRemove">
            <a-button danger :loading="loadingDeleteUser">
              <delete-outlined/>
              删除
            </a-button>
          </a-popconfirm>
        </a-space>
      </a-form-item>
    </a-form>
  </a-skeleton>
</template>

<script setup lang="ts">

import { apiGetUser, apiUpdateUser, apiResetPassword, apiDeleteUser } from '../../api/admin/user'
import { useRequest } from 'vue-request'
import { reactive } from 'vue'
import { getUserResp } from '../../api/admin/model/userModel'
import { RoleEnum } from '../../enums/roleEnum'
import dayjs from 'dayjs'
import { RuleObject } from 'ant-design-vue/es/form/interface'
import { DeleteOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { radioOption } from '../../api/common'
import { useForm } from 'ant-design-vue/es/form'
import { message } from 'ant-design-vue'

// eslint-disable-next-line no-undef,func-call-spacing
const emits = defineEmits<{
  (e: 'finish', refresh: boolean): void
}>()

// eslint-disable-next-line no-undef
const props = defineProps<{
  userId: number
}>()

const {
  data: dataUser,
  loading: loadingGetDataUser
} = useRequest(apiGetUser, {
  manual: false,
  formatResult: res => {
    return res.data.result
  },
  onSuccess: res => {
    updateUserState.userId = res.userId
    updateUserState.email = res.email
    updateUserState.username = res.username
    updateUserState.userNum = res.userNum
    if (res.grade === '') {
      updateUserState.grade = null
    } else {
      updateUserState.grade = dayjs(String(res.grade), 'YYYY')
    }
    updateUserState.school = res.school
    updateUserState.major = res.major
    updateUserState.organization = res.organization
    updateUserState.roleId = res.roleId
    updateUserState.createdAt = res.createdAt
    updateUserState.updatedAt = res.updatedAt
  },
  defaultParams: [
    props.userId
  ]
})

const updateUserState = reactive<getUserResp>({
  userId: 0,
  email: '',
  userNum: '',
  username: '',
  grade: '',
  school: '',
  gender: 0,
  major: '',
  organization: '',
  roleId: RoleEnum.NORMAL,
  createdAt: dayjs(),
  updatedAt: dayjs()
})

const rules = reactive<Record<string, RuleObject[]>>({
  username: [{
    required: true,
    message: '姓名不能为空'
  }],
  userNum: [
    {
      required: true,
      message: '学号不能为空'
    },
    {
      pattern: /^[0-9]*$/,
      message: '学号需为数字'
    }
  ],
  email: [
    {
      required: true,
      message: '邮箱不能为空'
    },
    {
      pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
      message: '需满足邮箱格式'
    }
  ],
  major: [{
    required: true,
    message: '专业不能为空'
  }],
  school: [{
    required: true,
    message: '学院不能为空'
  }],
  organization: [{
    required: true,
    message: '单位不能为空'
  }]
})

// 性别多选框
const genderRadioOption: radioOption[] = [
  {
    value: 0,
    label: '未知'
  },
  {
    value: 1,
    label: '男'
  },
  {
    value: 2,
    label: '女'
  }
]

// 校验规则
const { validate } = useForm(updateUserState, rules)

// 更新信息
const {
  run: runUpdateUser,
  loading: loadingUpdateUser,
  error: errUpdateUser
} = useRequest(apiUpdateUser)

const handleUpdateUserInfo = async() => {
  try {
    await validate()
  } catch (err) {
    message.error('输入数据不满足提交要求')
    return
  }
  await runUpdateUser(updateUserState)
  if (errUpdateUser.value) {
    return
  }
  emits('finish', true)
}

// 重置密码
const {
  run: runResetPassword,
  loading: loadingResetPassword
} = useRequest(apiResetPassword)

const handleResetPassword = () => {
  runResetPassword(props.userId)
}

const {
  run: runDeleteUser,
  loading: loadingDeleteUser,
  error: errDeleteUser
} = useRequest(apiDeleteUser)

// 删除用户
const handleRemove = async(userId: number) => {
  await runDeleteUser(userId)
  if (errDeleteUser.value) {
    return
  }
  emits('finish', true)
}
</script>

<style scoped>

</style>
