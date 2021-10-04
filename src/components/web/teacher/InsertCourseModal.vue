<template>
  <a-modal
    :visible="visibleModal"
    :ok-button-props="{ loading: loadingCreateCourse || loadingUpload }"
    cancel-text="取消"
    ok-text="新建"
    title="新建课程"
    width="800px"
    @cancel="cancel"
    @ok="handleCreateCourse"
  >
    <a-form
      :label-col="{ span: 3 }"
      :model="insertCourseState"
      :rules="rules"
      :wrapper-col="{ span: 20 }"
    >
      <a-form-item label="课程名" name="courseName">
        <a-input v-model:value="insertCourseState.courseName" />
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
          v-model:image-init-list="createCourseImageInitList"
          v-model:loading="loadingUpload"
          :size-limits="2"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { createCourseReq } from '../../../api/web/model/courseModel'
import { reactive, ref, watchEffect } from 'vue'
import { IFileItem, radioOption } from '../../../api/common'
import { useRequest } from 'vue-request'
import { apiCreateCourse } from '../../../api/web/course'
import UploadImageModal from '../../common/UploadImageModal.vue'
import { Form, message } from 'ant-design-vue'

const useForm = Form.useForm

// eslint-disable-next-line no-undef
const props = defineProps<{
  visibleModal: boolean
}>()

// eslint-disable-next-line no-undef,,func-call-spacing
const emits = defineEmits<{
  (e: 'update:visibleModal', src: boolean): void
  (e: 'refreshList'): void
}>()

const insertCourseState = reactive<createCourseReq>({
  courseName: '',
  courseDes: '',
  secretKey: '',
  languageType: 1,
  coverImg: ''
})

const loadingUpload = ref<boolean>(false)
const createCourseImageInitList = ref<IFileItem[]>([])

watchEffect(() => {
  if (createCourseImageInitList.value.length === 0) {
    createCourseImageInitList.coverImg = ''
    return
  }
  if (createCourseImageInitList.value[0].status === 'done') {
    createCourseImageInitList.coverImg =
      createCourseImageInitList.value[0].response.result.fileSrc
  }
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

const rules = reactive({
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
  emits('refreshList')
  cancel()
}

const cancel = () => {
  emits('update:visibleModal', false)
}

</script>

<style scoped></style>
