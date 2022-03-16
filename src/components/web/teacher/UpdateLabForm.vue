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
        <a-textarea v-model:value="updateLabState.content" :rows="4"/>
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
            :before-upload="beforeUpload"
            :max-count="1"
        >
          <a-button>
            <upload-outlined/>
            点击上传
          </a-button>
        </a-upload>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 3 }">
        <a-space>
          <a-button type="primary" @click="handleUpdateLab" :loading="loadingUpdateLab">
            <form-outlined/>
            修改
          </a-button>
          <a-popconfirm
              title="确认删除?"
              ok-text="确认"
              cancel-text="取消"
              @confirm="handleDeleteLab"
          >
            <a-button type="primary" danger :loading="loadingDeleteLab">
              <delete-outlined/>
              删除
            </a-button>
          </a-popconfirm>
        </a-space>
      </a-form-item>
    </a-form>
  </a-skeleton>
</template>

<script lang="ts" setup>
import { updateLabReq } from '../../../api/web/model/lab'
import { reactive, ref, watch } from 'vue'
import { Form, message } from 'ant-design-vue'
import { apiDeleteLab, apiGetLabDetail, apiUpdateLab } from '../../../api/web/lab'
import { UploadOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { useRequest } from 'vue-request'
import { fileSrc2File } from '../../../util/utils'
import type { UploadProps } from 'ant-design-vue'
import dayjs from 'dayjs'
import { UploadFile } from 'ant-design-vue/es/upload/interface'

// eslint-disable-next-line no-undef
const props = defineProps<{
  labId: number
}>()

// eslint-disable-next-line no-undef,func-call-spacing
const emits = defineEmits<{
  (e: 'finish'): void
}>()

const updateLabState = reactive<updateLabReq>({
  labId: 0,
  title: '',
  content: '',
  isRemoveFile: false,
  deadline: null
})

const { run: runGetLabDetail, loading: loadingLabDetail } = useRequest(apiGetLabDetail, {
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
    if (res.attachmentSrc !== '') {
      fileList.value = [
        fileSrc2File(res.attachmentSrc)
      ]
    }
  }
})

const fileList = ref<UploadFile[]>([])

watch(() => fileList.value.length, (oldV, newV) => {
  if (oldV > 0 && newV === 0) {
    updateLabState.isRemoveFile = true
  }
})

const beforeUpload: UploadProps['beforeUpload'] = file => {
  return false
}

const rules = reactive({
  title: [
    { required: true, message: '请输入标题' },
    { max: 16, message: '标题最长16字' }
  ],
  content: [{ required: true, message: '请输入内容' }]
})

const useForm = Form.useForm

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
  const formData = prepareUpdateData()
  await runUpdateLab(formData)
  if (errorUpdateLab.value) {
    return
  }
  emits('finish')
}

const prepareUpdateData = (): FormData => {
  const formData = new FormData()
  formData.set('title', updateLabState.title)
  formData.set('content', updateLabState.content)
  formData.set('labId', String(updateLabState.labId))
  formData.set('isRemoveFile', String(updateLabState.isRemoveFile))
  if (updateLabState.deadline !== null) {
    formData.set('deadline', updateLabState.deadline.toJSON())
  }
  if (fileList.value.length > 0) {
    formData.set('file', fileList.value[0] as any)
  }
  return formData
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
  emits('finish')
}

watch(props, () => {
  runGetLabDetail(
    props.labId
  )
})

</script>

<style scoped></style>
