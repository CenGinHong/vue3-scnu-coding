<template>
  <a-form
      :label-col="{ span: 3 }"
      :model="insertLabState"
      :rules="rules"
      :wrapper-col="{ span: 20 }"
  >
    <a-form-item label="实验名称" name="title">
      <a-input v-model:value="insertLabState.title"/>
    </a-form-item>
    <a-form-item label="实验内容" name="content">
      <a-textarea
          v-model:value="insertLabState.content"
          allow-clear
          rows="8"
      />
    </a-form-item>
    <a-form-item label="截止日期" name="deadline">
      <a-date-picker
          v-model:value="insertLabState.deadline"
          placeholder="请选择时间"
          show-time
          show-today
      />
    </a-form-item>
    <a-form-item label="上传附件">
      <a-upload
          :file-list="fileList"
          :before-upload="beforeUpload"
          :remove="handleRemove"
      >
        <a-button :disabled="fileList.length !== 0 || loadingInsertLab">
          <upload-outlined/>
          点击上传
        </a-button>
      </a-upload>
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 14, offset: 3 }">
      <a-space>
        <a-button type="primary" @click="handleInsertLab" :loading="loadingInsertLab">
          <form-outlined/>
          新建实验
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue'
import {insertLabReq} from '../../../api/web/model/lab'
import {useRequest} from 'vue-request'
import {apiInsertLab} from '../../../api/web/lab'
import {message} from 'ant-design-vue'
import {UploadOutlined, FormOutlined} from '@ant-design/icons-vue'
import {useForm} from 'ant-design-vue/es/form'
import {RuleObject} from 'ant-design-vue/es/form/interface'
import type {UploadProps} from 'ant-design-vue'
import {UploadFile} from 'ant-design-vue/es/upload/interface'
// eslint-disable-next-line no-undef
const props = defineProps<{
  courseId: number
}>()

// eslint-disable-next-line no-undef,func-call-spacing
const emits = defineEmits<{
  (e: 'finish'): void
}>()

const insertLabState = reactive<insertLabReq>({
  title: '',
  content: '',
  deadline: null,
  courseId: props.courseId
})

const rules = reactive<Record<string, RuleObject[]>>({
  title: [
    {required: true, message: '请输入标题'},
    {max: 16, message: '标题最长16字'}
  ],
  content: [{required: true, message: '请输入内容'}]
})

const {validate: validateInsertLab} = useForm(insertLabState, rules)

const {
  run: runInsertLab,
  loading: loadingInsertLab,
  error: errorInsertLab
} = useRequest(apiInsertLab)
// 新建上传文件

// 文件上传部分
const fileList = ref<UploadFile[]>([])

const handleRemove: UploadProps['onRemove'] = file => {
  const index = fileList.value!.indexOf(file)
  const newFileList = fileList.value!.slice()
  newFileList.splice(index, 1)
  fileList.value = newFileList
}

const beforeUpload: UploadProps['beforeUpload'] = file => {
  fileList.value = [file]
  return false
}

const prepareUpdateData = (): FormData => {
  const formData = new FormData()
  formData.set('title', insertLabState.title)
  formData.set('content', insertLabState.title)
  formData.set('courseId', String(insertLabState.courseId))
  if (insertLabState.deadline !== null) {
    formData.set('deadline', insertLabState.deadline.toJSON())
  }
  if (fileList.value!.length > 0) {
    formData.set('file', fileList.value![0] as any)
  }
  return formData
}

// 插入
const handleInsertLab = async () => {
  try {
    await validateInsertLab()
  } catch (err) {
    message.error('输入数据不满足提交要求')
    return
  }
  const formData = prepareUpdateData()
  await runInsertLab(formData)
  if (errorInsertLab.value) {
    return
  }
  emits('finish')
}

</script>

<style scoped></style>
