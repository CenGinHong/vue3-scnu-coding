<template>
  <a-skeleton active :loading="loadingLabDetail">
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
            v-model:file-list="fileList"
            :action="uploadApi"
            @change="handleUpdateUploadChange"
        >
          <a-button :disabled="fileList.length !== 0">
            <upload-outlined/>
            点击上传
          </a-button>
        </a-upload>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 3 }">
        <a-space>
          <a-button type="primary" @click="handleUpdateLab" :loading="loadingUpdateLab || loadingUpload">修改</a-button>
          <a-popconfirm
              title="确认删除?"
              ok-text="确认"
              cancel-text="取消"
              @confirm="handleDeleteLab"
          >
            <a-button type="primary" danger :loading="loadingDeleteLab">删除</a-button>
          </a-popconfirm>
          <a-button @click="handleCancel">取消</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </a-skeleton>
</template>

<script lang="ts" setup>
import { updateLabReq } from '../../../api/web/model/lab'
import { reactive, ref } from 'vue'
import { FileInfo, IFileItem } from '../../../api/common'
import { uploadApi } from '../../../api/web/file'
import { Form, message, Modal } from 'ant-design-vue'
import { apiDeleteLab, apiGetLabDetail, apiUpdateLab } from '../../../api/web/lab'
import { ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons-vue'
import { useRequest } from 'vue-request'
import { fileSrc2File } from '../../../util/utils'
import dayjs from 'dayjs'

// eslint-disable-next-line no-undef
const props = defineProps<{
  labId: number
}>()

const updateLabState = reactive<updateLabReq>({
  labId: 0,
  title: '',
  content: '',
  deadline: null
})
const fileList = ref<IFileItem[]>([])
const { loading: loadingLabDetail } = useRequest(apiGetLabDetail, {
  manual: false,
  defaultParams: [
    props.labId
  ],
  formatResult: (res) => {
    return res.data.result
  },
  onSuccess: (res) => {
    updateLabState.labId = res.labId
    updateLabState.content = res.content
    updateLabState.title = res.title
    if (res.deadline !== '') {
      updateLabState.deadline = dayjs(res.deadline)
    }
    if (res.attachmentSrc) {
      fileList.value = [
        fileSrc2File(res.attachmentSrc)
      ]
    }
    updateLabState.attachmentSrc = undefined
  }
})

// eslint-disable-next-line no-undef,func-call-spacing
const emits = defineEmits<{
  (e: 'finish', res: boolean): void
}>()

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
  emits('finish', true)
}

const handleCancel = () => {
  emits('finish', false)
}

// 删除实验
const {
  run: runDeleteLab,
  loading: loadingDeleteLab,
  error: errorDeleteLab
} = useRequest(apiDeleteLab)

const handleDeleteLab = async() => {
  await runDeleteLab(props.labId)
  if (errorDeleteLab.value) {
    return
  }
  emits('finish', true)
}

</script>

<style scoped></style>
