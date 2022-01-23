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
          v-model:file-list="insertFileList"
          :action="uploadApi"
          :before-upload="beforeUpload"
          @change="handleInsertUploadChange"
      >
        <a-button :disabled="insertFileList.length !== 0">
          <upload-outlined/>
          点击上传
        </a-button>
      </a-upload>
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 14, offset: 3 }">
      <a-space>
        <a-button type="primary" @click="handleInsertLab" :loading="loadingInsertLab || loadingUpload">
          <form-outlined/>
          新建实验</a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { insertLabReq } from '../../../api/web/model/lab'
import { useRequest } from 'vue-request'
import { apiInsertLab } from '../../../api/web/lab'
import { FileInfo, IFileItem } from '../../../api/common'
import { message } from 'ant-design-vue'
import { uploadApi } from '../../../api/web/file'
import { UploadOutlined, FormOutlined } from '@ant-design/icons-vue'
import { useForm } from 'ant-design-vue/es/form'
import { RuleObject } from 'ant-design-vue/es/form/interface'
// eslint-disable-next-line no-undef
const props = defineProps<{
  courseId: number
}>()

// eslint-disable-next-line no-undef,func-call-spacing
const emits = defineEmits<{
  (e: 'finish', res: boolean): void
}>()

const insertLabState = reactive<insertLabReq>({
  title: '',
  content: '',
  attachmentSrc: '',
  courseId: props.courseId
})

const rules = reactive<Record<string, RuleObject[]>>({
  title: [
    { required: true, message: '请输入标题' },
    { max: 16, message: '标题最长16字' }
  ],
  content: [{ required: true, message: '请输入内容' }]
})

const { validate: validateInsertLab } = useForm(insertLabState, rules)

const {
  run: runInsertLab,
  loading: loadingInsertLab,
  error: errorInsertLab
} = useRequest(apiInsertLab)
// 新建上传文件
const insertFileList = ref<IFileItem[]>([])
// 插入
const handleInsertLab = async() => {
  try {
    await validateInsertLab()
  } catch (err) {
    message.error('输入数据不满足提交要求')
    return
  }
  await runInsertLab(insertLabState)
  if (errorInsertLab.value) {
    return
  }
  emits('finish', true)
}

const loadingUpload = ref<boolean>(false)

const handleInsertUploadChange = (info: FileInfo) => {
  const status = info.file.status
  // 上传成功
  switch (status) {
    case 'done': {
      message.success(`${info.file.name}上传成功`)
      loadingUpload.value = false
      // 将文件url置入
      if (info.file.response!.code === 0) {
        insertLabState.attachmentSrc = info.file.response!.result!.fileSrc
      }
      break
    }
    case 'error': {
      loadingUpload.value = false
      message.error(`${info.file.name}上传失败`)
      break
    }
    case 'removed': {
      loadingUpload.value = false
      insertLabState.attachmentSrc = ''
      break
    }
    case 'uploading ': {
      loadingUpload.value = true
      break
    }
  }
}

const beforeUpload = (file: IFileItem) => {
}
</script>

<style scoped></style>
