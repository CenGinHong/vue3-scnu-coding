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
            rows="5"
        />
      </a-form-item>
      <a-form-item label="上传附件">
        <div>
          <a-upload
              v-model:file-list="fileList"
              :action="uploadApi"
              :before-upload="beforeUpload"
              @change="handleUpdateUploadChange"
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
                    :loading="loadingUpdateCourseAnnouncement || loadingUpload">修改
          </a-button>
          <a-popconfirm
              title="确认删除?"
              ok-text="确认"
              cancel-text="取消"
              @confirm="handleUpdateCourseAnnouncement"
          >
            <a-button type="primary" danger :loading="loadingDeleteCourseAnnouncement">删除</a-button>
          </a-popconfirm>
          <a-button @click="handleCancel">取消</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </a-skeleton>
</template>

<script lang="ts" setup>
import { createVNode, reactive, ref, watchEffect } from 'vue'
import { FileInfo, IFileItem } from '../../../api/common'
import { message, Modal } from 'ant-design-vue'
import { useRequest } from 'vue-request'
import { uploadApi } from '../../../api/web/file'
import {
  apiDeleteCourseAnnouncement,
  apiGetCourseAnnouncementDetail,
  apiUpdateCourseAnnouncement
} from '../../../api/web/courseAnnouncement'
import { ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons-vue'
import {
  courseAnnouncementDetailResp,
  updateCourseAnnouncementReq
} from '../../../api/web/model/courseAnnouncement'
import { RuleObject } from 'ant-design-vue/lib/form'
import { fileSrc2File } from '../../../util/utils'

// eslint-disable-next-line no-undef
const props = defineProps<{
  courseAnnouncementId: number
}>()

// eslint-disable-next-line no-undef,func-call-spacing
const emits = defineEmits<{
  (e: 'finish', res: boolean): void
}>()

const updateCourseAnnouncementState = reactive<updateCourseAnnouncementReq>({
  courseAnnouncementId: 0,
  title: '',
  content: ''
})

// 更新文件列表
const fileList = ref<IFileItem[]>([])

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
  emits('finish', true)
}

const handleCancel = () => {
  emits('finish', false)
}

// 删除
const {
  run: runDeleteCourseAnnouncement,
  loading: loadingDeleteCourseAnnouncement,
  error: errDeleteCourseAnnouncement
} = useRequest(apiDeleteCourseAnnouncement)

// 删除公告
const handleDeleteCourseAnnouncement = async(courseAnnouncementId: number) => {
  await runDeleteCourseAnnouncement(courseAnnouncementId)
  if (errDeleteCourseAnnouncement.value) {
    return
  }
  emits('finish', true)
}

const beforeUpload = (file: IFileItem) => {
}
</script>

<style scoped></style>
