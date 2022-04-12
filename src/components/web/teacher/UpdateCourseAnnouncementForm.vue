<template>
  <a-skeleton active :loading="loadingCourseAnnouncementDetail">
    <a-form
        :label-col="{ span: 3 }"
        :model="updateCourseAnnouncementState"
        :rules="rules"
        :wrapper-col="{ span: 20 }"
    >
      <a-form-item label="公告名称" name="title">
        <a-input v-model:value="updateCourseAnnouncementState.title"/>
      </a-form-item>
      <a-form-item label="公告内容" name="content">
        <a-textarea
            v-model:value="updateCourseAnnouncementState.content"
            :rows="5"
        />
      </a-form-item>
      <a-form-item label="上传附件">
        <div>
          <a-upload
              :file-list="fileList"
              @remove="handleRemove"
              :before-upload="beforeUpload"
          >
            <a-button :disabled="fileList.length !== 0">
              <upload-outlined/>
              点击上传
            </a-button>
          </a-upload>
        </div>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 3 }">
        <a-space>
          <a-button type="primary" @click="handleUpdateCourseAnnouncement"
                    :loading="loadingUpdateCourseAnnouncement || loadingUpload">
            <form-outlined/>
            修改
          </a-button>
          <a-popconfirm
              title="确认删除?"
              ok-text="确认"
              cancel-text="取消"
              @confirm="handleDeleteCourseAnnouncement"
          >
            <a-button type="primary" danger :loading="loadingDeleteCourseAnnouncement">
              <delete-outlined/>
              删除</a-button>
          </a-popconfirm>
        </a-space>
      </a-form-item>
    </a-form>
  </a-skeleton>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { message, UploadProps } from 'ant-design-vue'
import { useRequest } from 'vue-request'
import { uploadApi } from '../../../api/web/file'
import {
  apiDeleteCourseAnnouncement,
  apiGetCourseAnnouncementDetail,
  apiUpdateCourseAnnouncement
} from '../../../api/web/courseAnnouncement'
import { ExclamationCircleOutlined, UploadOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import {
  updateCourseAnnouncementReq
} from '../../../api/web/model/courseAnnouncement'
import { RuleObject } from 'ant-design-vue/lib/form'
import { fileSrc2File } from '../../../util/utils'
import { UploadFile } from 'ant-design-vue/es/upload/interface'
import { useForm } from 'ant-design-vue/es/form'

// eslint-disable-next-line no-undef
const props = defineProps<{
  courseAnnouncementId: number
}>()

// eslint-disable-next-line no-undef,func-call-spacing
const emits = defineEmits<{
  (e: 'finish'): void
}>()

const updateCourseAnnouncementState = reactive<updateCourseAnnouncementReq>({
  courseAnnouncementId: 0,
  isRemoveFile: false,
  title: '',
  content: ''
})

// 更新文件列表
const fileList = ref<UploadFile[]>([])

const { loading: loadingCourseAnnouncementDetail } = useRequest(apiGetCourseAnnouncementDetail, {
  manual: false,
  formatResult: (res) => {
    return res.data.result
  },
  defaultParams: [
    props.courseAnnouncementId
  ],
  onSuccess: (res) => {
    updateCourseAnnouncementState.courseAnnouncementId = res.courseAnnouncementId
    updateCourseAnnouncementState.title = res.title
    updateCourseAnnouncementState.content = res.content
    if (res.attachmentSrc !== '') {
      fileList.value = [fileSrc2File(res.attachmentSrc)]
    }
  }
})

const rules = reactive<Record<string, RuleObject[]>>({
  title: [
    { required: true, message: '标题不能为空' },
    { max: 16, message: '标题最长16字' }
  ],
  content: [{ required: true, message: '内容不能为空' }]
})

const loadingUpload = ref<boolean>(false)

const prepareInsertData = (): FormData => {
  const formData = new FormData()
  formData.set('title', updateCourseAnnouncementState.title)
  formData.set('content', updateCourseAnnouncementState.content)
  formData.set('courseAnnouncementId', String(props.courseAnnouncementId))
  formData.set('isRemoveFile', String(updateCourseAnnouncementState.isRemoveFile))
  if (fileList.value.length > 0) {
    formData.set('file', fileList.value[0] as any)
  }
  return formData
}

const { validate: validateInsertAnnouncement } = useForm(updateCourseAnnouncementState, rules)

// 更新公告
const {
  run: runUpdateCourseAnnouncement,
  loading: loadingUpdateCourseAnnouncement,
  error: errorUpdateCourseAnnouncement
} = useRequest(apiUpdateCourseAnnouncement)

// 更新公告
const handleUpdateCourseAnnouncement = async() => {
  try {
    await validateInsertAnnouncement()
  } catch (err) {
    message.error('输入数据不满足提交要求')
    return
  }
  const formData = prepareInsertData()
  await runUpdateCourseAnnouncement(formData)
  if (errorUpdateCourseAnnouncement.value) {
    return
  }
  emits('finish')
}

// 删除
const {
  run: runDeleteCourseAnnouncement,
  loading: loadingDeleteCourseAnnouncement,
  error: errDeleteCourseAnnouncement
} = useRequest(apiDeleteCourseAnnouncement)

// 删除公告
const handleDeleteCourseAnnouncement = async() => {
  await runDeleteCourseAnnouncement(props.courseAnnouncementId)
  if (errDeleteCourseAnnouncement.value) {
    return
  }
  emits('finish')
}

const beforeUpload: UploadProps['beforeUpload'] = file => {
  fileList.value = [file]
  return false
}
const handleRemove: UploadProps['onRemove'] = file => {
  const index = fileList.value.indexOf(file)
  const newFileList = fileList.value.slice()
  newFileList.splice(index, 1)
  fileList.value = newFileList
}
</script>

<style scoped></style>
