<template>
  <a-form
      :label-col="{ span: 3 }"
      :model="insertCourseState"
      :rules="rules"
      :wrapper-col="{ span: 20 }"
  >
    <a-form-item label="课程名" name="courseName">
      <a-input v-model:value="insertCourseState.courseName"/>
    </a-form-item>
    <a-form-item label="课程简介" name="courseDes">
      <a-textarea
          v-model:value="insertCourseState.courseDes"
          :maxlength="250"
          allow-clear
          rows="5"
          showCount
      />
    </a-form-item>
    <a-form-item label="课程密钥" name="SecretKey">
      <a-input
          v-model:value="insertCourseState.secretKey"
          placeholder="请输入6位加入课程的数字密钥"
      />
    </a-form-item>
    <a-form-item label="编程语言">
      <a-radio-group
          v-model:value="insertCourseState.languageType"
          :options="languageRadioOption"
      />
    </a-form-item>
    <a-form-item label="课程封面">
      <upload-image-modal
          v-model:image-list="fileList"
          :image-length="1"
      />
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 14, offset: 3 }">
      <a-space>
        <a-button type="primary" @click="handleCreateCourse" :loading="loadingCreateCourse">
          <form-outlined/>
          新建</a-button>
      </a-space>
    </a-form-item>
  </a-form>
  <a-button @click="handlei">
    123
  </a-button>
</template>

<script lang="ts" setup>
import { createCourseReq } from '../../../api/web/model/courseModel'
import { reactive, ref, watchEffect } from 'vue'
import { radioOption } from '../../../api/common'
import { useRequest } from 'vue-request'
import { apiCreateCourse } from '../../../api/web/course'
import UploadImageModal from '../../common/UploadImageModal.vue'
import { message } from 'ant-design-vue'
import { useForm } from 'ant-design-vue/es/form'
import { RuleObject } from 'ant-design-vue/es/form/interface'
import { FormOutlined } from '@ant-design/icons-vue'
import { UploadFile } from 'ant-design-vue/es/upload/interface'

// eslint-disable-next-line no-undef,,func-call-spacing
const emits = defineEmits<{
  (e: 'finish'): void
}>()

const handlei = () => {
  console.log(fileList.value)
}

const insertCourseState = reactive<createCourseReq>({
  courseName: '',
  courseDes: '',
  secretKey: '',
  languageType: 1,
  coverImg: ''
})

const fileList = ref<UploadFile[]>([])

watchEffect(() => {
  console.log(fileList)
})

// 可选的语言
const languageRadioOption = reactive<radioOption[]>([
  {
    label: 'Cpp',
    value: 1
  },
  {
    label: 'Java',
    value: 2
  },
  {
    label: 'Python',
    value: 3
  }
])

const rules = reactive<Record<string, RuleObject[]>>({
  courseName: [
    { required: true, message: '课程名不能为空' },
    {
      max: 16,
      message: '课程名最长16字'
    }
  ],
  courseDes: [{ required: true, message: '课程描述不能为空' }]
})

const {
  run: runCreateCourse,
  error: errCreateCourse,
  loading: loadingCreateCourse
} = useRequest(apiCreateCourse)

const { validate: validateCourseState } = useForm(insertCourseState, rules)

const handleCreateCourse = async() => {
  try {
    await validateCourseState()
  } catch (err) {
    message.error('输入数据不满足提交要求')
    return
  }
  await runCreateCourse(insertCourseState)
  if (errCreateCourse.value) {
    return
  }
  emits('finish')
}

</script>

<style scoped></style>
