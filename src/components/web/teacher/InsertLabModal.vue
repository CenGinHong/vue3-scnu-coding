<template>
  <a-modal
    :visible="visible"
    :ok-button-props="{ loading: loadingInsertLab||loadingUpload }"
    cancel-text="取消"
    ok-text="确认新建"
    title="新建实验"
    width="800px"
    @cancel="handleCancel"
    @ok="handleInsertLab"
  >
    <a-form
      :label-col="{ span: 3 }"
      :model="insertLabState"
      :rules="rules"
      :wrapper-col="{ span: 20 }"
    >
      <a-form-item label="实验名称" name="title">
        <a-input v-model:value="insertLabState.title" />
      </a-form-item>
      <a-form-item label="实验内容" name="content">
        <a-textarea
          v-model:value="insertLabState.content"
          allow-clear
          rows="4"
        />
      </a-form-item>
      <a-form-item label="截止日期">
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
            <upload-outlined />
            点击上传
          </a-button>
        </a-upload>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
// 新建实验
import { reactive, ref } from 'vue'
import { insertLabReq } from '../../../api/web/model/lab'
import { useRequest } from 'vue-request'
import { apiInsertLab } from '../../../api/web/lab'
import { FileInfo, IFileItem } from '../../../api/common'
import { Form, message } from 'ant-design-vue'
import { uploadApi } from '../../../api/web/file'
import { UploadOutlined } from '@ant-design/icons-vue'

const useForm = Form.useForm

// eslint-disable-next-line no-undef
const props = defineProps<{
  courseId: number
  visible: boolean
}>()

// eslint-disable-next-line no-undef,func-call-spacing
const emits = defineEmits<{
  (e: 'update:visible', src: boolean): void
  (e: 'refreshList'): void
}>()

const insertLabState = reactive<insertLabReq>({
  title: '',
  content: '',
  attachmentSrc: '',
  courseId: props.courseId
})

const rules = reactive({
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
} = useRequest(apiInsertLab, {
  formatResult: (res) => {
    return res.data.result
  }
})
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
  emits('refreshList')
  handleCancel()
}

const handleCancel = () => {
  emits('update:visible', false)
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
      insertLabState.attachmentSrc = ''
      break
    }
    case 'uploading ': {
      loadingUpload.value = true
      break
    }
  }
}

const beforeUpload = (file: IFileItem) => {}
</script>

<style scoped></style>
