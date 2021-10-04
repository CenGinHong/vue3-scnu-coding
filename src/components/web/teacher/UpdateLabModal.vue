<template>
  <a-modal
      :visible="visible"
      :ok-button-props="{ loading: loadingUpdateLab||loadingUpload }"
      cancel-text="取消"
      ok-text="确认修改"
      title="修改实验"
      @cancel="handleCancel"
      width="800px"
      @ok="handleUpdateLab"
  >
    <a-form
        :label-col="{ span: 3 }"
        :model="updateLabState"
        :rules="rules"
        :wrapper-col="{ span: 20 }"
    >
      <a-form-item label="实验名称" name="title">
        <a-input v-model:value="updateLabState.title"/>
      </a-form-item>
      <a-form-item label="实验内容" name="content">
        <a-textarea v-model:value="updateLabState.content" rows="4"/>
      </a-form-item>
      <a-form-item label="截止日期">
        <a-date-picker
            v-model:value="updateLabState.deadline"
            placeholder="请选择时间"
            show-time
            show-today
        />
      </a-form-item>
      <a-form-item label="上传附件">
        <a-upload
            v-model:file-list="updateFileList"
            :action="uploadApi"
            @change="handleUpdateUploadChange"
        >
          <a-button :disabled="updateFileList.length !== 0">
            <upload-outlined/>
            点击上传
          </a-button>
        </a-upload>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { updateLabReq } from '../../../api/web/model/lab'
import { reactive, ref, watchEffect } from 'vue'
import { FileInfo, IFileItem } from '../../../api/common'
import { updateLabExtendReq } from './TeacherLabList.vue'
import { uploadApi } from '../../../api/web/file'
import { Form, message } from 'ant-design-vue'
import { apiUpdateLab } from '../../../api/web/lab'
import { UploadOutlined } from '@ant-design/icons-vue'
import { useRequest } from 'vue-request'

// eslint-disable-next-line no-undef
const props = defineProps<{
  updateLabInitState: updateLabExtendReq
  visible: boolean
}>()

// eslint-disable-next-line no-undef,func-call-spacing
const emits = defineEmits<{
  (e: 'update:visible', src: boolean): void
  (e: 'refreshList'): void
}>()

const updateLabState = reactive<updateLabReq>({
  labId: 0,
  title: '',
  content: '',
  deadline: null
})

const updateFileList = ref<IFileItem[]>([])

watchEffect(() => {
  updateLabState.labId = props.updateLabInitState.labId
  updateLabState.content = props.updateLabInitState.content
  updateLabState.title = props.updateLabInitState.title
  updateLabState.deadline = props.updateLabInitState.deadline
  updateFileList.value = props.updateLabInitState.fileList
  updateLabState.attachmentSrc = undefined
})

const loadingUpload = ref<boolean>(false)

const handleUpdateUploadChange = (info: FileInfo) => {
  const status = info.file.status
  // 上传成功
  switch (status) {
    case 'done': {
      loadingUpload.value = false
      message.success(`${info.file.name}上传成功`)
      // 将文件url置入
      if (info.file.response!.code === 0) {
        updateLabState.attachmentSrc = info.file.response!.result!.fileSrc
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
      updateLabState.attachmentSrc = ''
      break
    }
    case 'uploading ': {
      loadingUpload.value = true
      break
    }
  }
}

const useForm = Form.useForm

const rules = reactive({
  title: [
    { required: true, message: '请输入标题' },
    { max: 16, message: '标题最长16字' }
  ],
  content: [{ required: true, message: '请输入内容' }]
})

const { validate: validateUpdateLab } = useForm(updateLabState, rules)

const {
  run: runUpdateLab,
  loading: loadingUpdateLab,
  error: errorUpdateLab
} = useRequest(apiUpdateLab)

const handleUpdateLab = async() => {
  try {
    await validateUpdateLab()
  } catch (err) {
    message.error('输入数据不满足提交要求')
    return
  }
  await runUpdateLab(updateLabState)
  if (errorUpdateLab.value) {
    return
  }
  handleCancel()
  emits('refreshList')
}

const handleCancel = () => {
  emits('update:visible', false)
}

</script>

<style scoped></style>
