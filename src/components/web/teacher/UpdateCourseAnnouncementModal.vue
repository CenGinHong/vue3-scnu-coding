<template>
  <a-modal
    :visible="visible"
    :ok-button-props="{ loading: loadingUpdateCourseAnnouncement }"
    cancel-text="取消"
    ok-text="确认修改"
    :destroyOnClose="true"
    title="修改公告"
    width="800px"
    @cancel="handleCancel"
    @ok="handleUpdateCourseAnnouncement"
  >
    <a-form
      :label-col="{ span: 3 }"
      :model="updateCourseAnnouncementState"
      :rules="rules"
      :wrapper-col="{ span: 20 }"
    >
      <a-form-item label="公告名称" name="title">
        <a-input v-model:value="updateCourseAnnouncementState.title" />
      </a-form-item>
      <a-form-item label="公告内容" name="content">
        <a-textarea
          v-model:value="updateCourseAnnouncementState.content"
          rows="5"
        />
      </a-form-item>
      <a-form-item label="上传附件">
        <div>
          <a-upload
            v-model:file-list="updateFileList"
            :action="uploadApi"
            :before-upload="beforeUpload"
            @change="handleUpdateUploadChange"
          >
            <a-button :disabled="updateFileList.length !== 0">
              <upload-outlined />
              点击上传
            </a-button>
          </a-upload>
        </div>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { reactive, ref, watchEffect } from 'vue'
import { FileInfo, IFileItem } from '../../../api/common'
import { message } from 'ant-design-vue'
import { useRequest } from 'vue-request'
import { uploadApi } from '../../../api/web/file'
import { apiUpdateCourseAnnouncement } from '../../../api/web/courseAnnouncement'
import { UploadOutlined } from '@ant-design/icons-vue'
import {
  courseAnnouncementListResp,
  updateCourseAnnouncementReq
} from '../../../api/web/model/courseAnnouncement'

// eslint-disable-next-line no-undef
const props = defineProps<{
  updateCourseAnnouncementInitState: courseAnnouncementListResp
  visible: boolean
}>()

// eslint-disable-next-line no-undef,func-call-spacing
const emits = defineEmits<{
  (e: 'update:visible', src: boolean): void
  (e: 'refreshList'): void
}>()

const updateCourseAnnouncementState = reactive<updateCourseAnnouncementReq>({
  courseAnnouncementId: 0,
  title: '',
  content: ''
})

watchEffect(() => {
  updateCourseAnnouncementState.courseAnnouncementId =
    props.updateCourseAnnouncementInitState.courseAnnouncementId
  updateCourseAnnouncementState.title =
    props.updateCourseAnnouncementInitState.title
  updateCourseAnnouncementState.content =
    props.updateCourseAnnouncementInitState.content
})
// 更新文件列表
const updateFileList = ref<IFileItem[]>(
  props.updateCourseAnnouncementInitState.fileList
)

const rules = {
  title: [
    { required: true, message: '标题不能为空' },
    { max: 16, message: '标题最长16字' }
  ],
  content: [{ required: true, message: '内容不能为空' }]
}

const loadingUpload = ref<boolean>(false)

// 上传文件更新逻辑
const handleUpdateUploadChange = (info: FileInfo) => {
  const status = info.file.status
  // 上传成功
  switch (status) {
    case 'done': {
      loadingUpload.value = false
      message.success(`${info.file.name}上传成功`)
      // 将文件url置入
      if (info.file.response!.code === 0) {
        updateCourseAnnouncementState.attachmentSrc =
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
      loadingUpload.value = false
      updateCourseAnnouncementState.attachmentSrc = ''
      break
    }
    case 'uploading ': {
      loadingUpload.value = true
      break
    }
  }
}

// 更新公告
const {
  run: runUpdateCourseAnnouncement,
  loading: loadingUpdateCourseAnnouncement,
  error: errorUpdateCourseAnnouncement
} = useRequest(apiUpdateCourseAnnouncement)

// 更新公告
const handleUpdateCourseAnnouncement = async() => {
  await runUpdateCourseAnnouncement(updateCourseAnnouncementState)
  if (errorUpdateCourseAnnouncement.value) {
    return
  }
  emits('refreshList')
  handleCancel()
}

const handleCancel = () => {
  emits('update:visible', false)
}

const beforeUpload = (file: IFileItem) => {}
</script>

<style scoped></style>
