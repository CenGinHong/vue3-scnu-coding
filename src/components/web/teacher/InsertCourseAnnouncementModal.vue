<template>
  <a-modal
      :visible="visible"
      :ok-button-props="{ loading: loadingInsertCourseAnnouncement||loadingUpload }"
      cancel-text="取消"
      ok-text="新建"
      title="新建公告"
      width="800px"
      @cancel="handleCancel"
      :destroyOnClose="true"
      @ok="handleInsertCourseAnnouncement"
  >
    <a-form
        :label-col="{ span: 3 }"
        :model="insertAnnouncementState"
        :rules="rules"
        :wrapper-col="{ span: 20 }"
    >
      <a-form-item label="公告名称" name="title">
        <a-input v-model:value="insertAnnouncementState.title"/>
      </a-form-item>
      <a-form-item label="公告内容" name="content">
        <a-textarea v-model:value="insertAnnouncementState.content" rows="5"/>
      </a-form-item>
      <a-form-item label="上传附件">
        <div>
          <a-upload
              v-model:file-list="insertFileList"
              :action="uploadApi"
              :before-upload="beforeUpload"
              @change="handleInsertUploadChange"
          >
            <a-button>
              <upload-outlined/>
              点击上传
            </a-button>
          </a-upload>
        </div>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>

// 新建公告api
import { useRequest } from 'vue-request'
import { apiInsertCourseAnnouncement } from '../../../api/web/courseAnnouncement'
import { FileInfo, IFileItem } from '../../../api/common'
import { Form, message } from 'ant-design-vue'
import { reactive, ref } from 'vue'
import { insertCourseAnnouncementReq } from '../../../api/web/model/courseAnnouncement'
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

// 新建公告文件列表
const insertFileList = ref<IFileItem[]>([])
// 新建公告数据
const insertAnnouncementState = reactive<insertCourseAnnouncementReq>({
  title: '',
  content: '',
  courseId: props.courseId,
  attachmentSrc: ''
})

const rules = reactive({
  title: [
    { required: true, message: '标题不能为空' },
    { max: 16, message: '标题最长16字' }
  ],
  content: [{ required: true, message: '内容不能为空' }]
})

const {
  run: runInsertCourseAnnouncement,
  loading: loadingInsertCourseAnnouncement,
  error: errorInsertCourseAnnouncement
} = useRequest(apiInsertCourseAnnouncement)

const handleCancel = () => {
  emits('update:visible', false)
}

const loadingUpload = ref<boolean>(false)

// 上传文件更新逻辑
const handleInsertUploadChange = (info: FileInfo) => {
  const status = info.file.status
  // 上传成功
  switch (status) {
    case 'done': {
      message.success(`${info.file.name}上传成功`)
      loadingUpload.value = false
      // 将文件url置入
      if (info.file.response!.code === 0) {
        insertAnnouncementState.attachmentSrc =
            info.file.response!.result!.fileSrc
      }
      break
    }
    case 'error': {
      loadingUpload.value = false
      message.error(`${info.file.name}上传失败`)
      break
    }
    case 'removed': {
      insertAnnouncementState.attachmentSrc = ''
      break
    }
    case 'uploading ': {
      loadingUpload.value = true
      break
    }
  }
}

const { validate: validateInsertAnnouncement } = useForm(insertAnnouncementState, rules)

// 新建公告
const handleInsertCourseAnnouncement = async() => {
  try {
    await validateInsertAnnouncement()
  } catch (err) {
    message.error('输入数据不满足提交要求')
    return
  }
  await runInsertCourseAnnouncement(insertAnnouncementState)
  if (errorInsertCourseAnnouncement.value) {
    return
  }
  emits('refreshList')
  handleCancel()
}

const beforeUpload = (file: IFileItem) => {}

</script>

<style scoped>

</style>
