<template>
  <div :class="style.insertDiv">
    <a-button type="primary" @click="visibleInsertModal=true">
      <form-outlined/>
      新建公告
    </a-button>
  </div>
  <base-course-announcement-list :data-course="dataCourseAnnouncement?.records"
                                 :loading="loadingCourseAnnouncement"
                                 :pag="pag">
    <template #actions="{ item }">
      <a-button :class="style.updateBtu" type="link" @click="handleShowModalUpdateAnnouncement(item)">
        <edit-outlined/>
        修改
      </a-button>
      <a-button danger type="link" @click="handleDeleteCourseAnnouncement(item.courseAnnouncementId)">
        <delete-outlined/>
        删除
      </a-button>
    </template>
  </base-course-announcement-list>
  <a-modal
      v-model:visible="visibleUpdateModal"
      :ok-button-props="{ loading: loadingUpdateCourseAnnouncement }"
      cancel-text="取消"
      ok-text="确认修改"
      title="修改公告"
      width="1000px"
      @ok="handleUpdateCourseAnnouncement">
    <a-form :label-col="{ span: 3 }" :model="updateAnnouncementState" :wrapper-col="{ span: 20 }">
      <a-form-item label="公告名称">
        <a-input v-model:value="updateAnnouncementState.title"/>
      </a-form-item>
      <a-form-item label="公告内容">
        <a-textarea v-model:value="updateAnnouncementState.content" rows="5"/>
      </a-form-item>
      <a-form-item label="上传附件">
        <div :class="style.uploadDiv">
          <a-upload
              :before-upload="updateBeforeUpload">
            <a-button>
              <upload-outlined/>
              点击上传
            </a-button>
          </a-upload>
        </div>
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal
      v-model:visible="visibleInsertModal"
      :ok-button-props="{ loading: loadingInsertCourseAnnouncement }"
      cancel-text="取消"
      ok-text="新建"
      title="新建公告"
      width="1000px"
      @ok="handleInsertCourseAnnouncement">
    <a-form :label-col="{ span: 3 }" :model="insertAnnouncementState" :wrapper-col="{ span: 20 }">
      <a-form-item label="公告名称">
        <a-input v-model:value="insertAnnouncementState.title"/>
      </a-form-item>
      <a-form-item label="公告内容">
        <a-textarea v-model:value="insertAnnouncementState.content" rows="5"/>
      </a-form-item>
      <a-form-item label="上传附件">
        <div :class="style.uploadDiv">
          <a-upload
              :before-upload="insertBeforeUpload">
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
import {computed, createVNode, reactive, ref, useCssModule} from 'vue'
import BaseCourseAnnouncementList from '../BaseCourseAnnouncementList.vue'
import {usePagination, useRequest} from 'vue-request'
import {
  apiDeleteCourseAnnouncement,
  apiInsertCourseAnnouncement,
  apiListCourseAnnouncement, apiUpdateCourseAnnouncement
} from '../../../api/web/courseAnnouncement'
import {IFileItem, pagination} from '../../../api/common'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  FormOutlined,
  UploadOutlined,
  LinkedinOutlined
} from '@ant-design/icons-vue'
import {
  courseAnnouncementListResp,
  insertCourseAnnouncementReq,
  updateCourseAnnouncementReq
} from '../../../api/web/model/courseAnnouncement'
import moment from 'moment'
import {message, Modal} from 'ant-design-vue'
import {apiUploadFile} from '../../../api/web/file'

// eslint-disable-next-line no-undef
const props = defineProps<{
  courseId: number
}>()

// 获取公告列表
const {
  data: dataCourseAnnouncement,
  loading: loadingCourseAnnouncement,
  refresh: refreshCourseAnnouncement,
  pageSize,
  current,
  total
} = usePagination(apiListCourseAnnouncement, {
  manual: false,
  formatResult: (res) => {
    return res.data.result
  },
  defaultParams: [
    {
      courseId: props.courseId
    }
  ]
})

// 分页数据
const pag = computed<pagination>(() => ({
  onChange: (page: number) => {
    current.value = page
  },
  total: total.value,
  pageSize: pageSize.value
}))

// 上传文件
const {run: runUpload, data: dataUpload} = useRequest(apiUploadFile, {
  formatResult: (res) => {
    return res.data.result
  }
})

const beforeUpload = (file: IFileItem) => {
  const supportUploadType: string[] = ['image/jpeg', 'image/png']
  // 该类型不支持
  if (file.type === undefined || !supportUploadType.includes(file.type)) {
    message.error('不支持的上传文件类型')
  }
  const isLt2M = file.size / 1024 / 1024 < 1
  if (!isLt2M) {
    message.error('图片大小需小于1MB!')
  }
  return false
}

// 可见更新框
const visibleUpdateModal = ref<boolean>(false)
// 更新文件列表
const updateFileList = ref<IFileItem[]>([])
// 更新表单
const updateAnnouncementState = reactive<updateCourseAnnouncementReq>({
  courseAnnouncementId: 0,
  title: '',
  content: ''
})
// 更新框可见方法
const handleShowModalUpdateAnnouncement = (item: courseAnnouncementListResp) => {
  updateAnnouncementState.courseAnnouncementId = item.courseAnnouncementId
  updateAnnouncementState.title = item.title
  updateAnnouncementState.content = item.content
  if (item.attachmentFileDetail) {
    const file: IFileItem = {
      uid: item.attachmentFileDetail.localFileId,
      url: item.attachmentFileDetail.url,
      size: item.attachmentFileDetail.size,
      type: item.attachmentFileDetail.contentType
    }
    updateFileList.value = [file]
  }
  visibleUpdateModal.value = true
}

// 更新公告
const {
  run: runUpdateCourseAnnouncement,
  loading: loadingUpdateCourseAnnouncement,
  error: errorUpdateCourseAnnouncement
} = useRequest(apiUpdateCourseAnnouncement)

const handleUpdateCourseAnnouncement = async () => {
  // 先上传文件
  if (updateFileList.value.length > 0) {
    const formData = new FormData()
    formData.append('file', insertFileList.value[0] as any)
    await runUpload(formData)
    if (errorDeleteCourseAnnouncement.value) {
      return
    }
    insertAnnouncementState.attachmentFileId = dataUpload.value!.fileId
  }
  await runUpdateCourseAnnouncement(updateAnnouncementState)
  if (errorUpdateCourseAnnouncement.value) {
    return
  }
  await refreshCourseAnnouncement()
  visibleUpdateModal.value = false
}

// 删除
const {
  run: runDeleteCourseAnnouncement,
  loading: loadingDeleteCourseAnnouncement,
  error: errorDeleteCourseAnnouncement
} = useRequest(apiDeleteCourseAnnouncement)
const handleDeleteCourseAnnouncement = (courseAnnouncementId: number) => {
  Modal.confirm({
    title: '您确认要删除该公告吗',
    icon: createVNode(ExclamationCircleOutlined),
    content: '删除不可挽回，请确认',
    onOk: async () => {
      await runDeleteCourseAnnouncement({id: courseAnnouncementId})
      if (errorDeleteCourseAnnouncement.value) {
        return
      }
      await refreshCourseAnnouncement()
    },
    onCancel() {
    },
    okButtonProps: {loading: loadingDeleteCourseAnnouncement.value},
    okText: '确认删除',
    cancelText: '取消'
  })
}

// 插入框可见
const visibleInsertModal = ref<boolean>(false)
// 新建公告文件列表
const insertFileList = ref<IFileItem[]>([])
// 新建公告数据
const insertAnnouncementState = reactive<insertCourseAnnouncementReq>({
  title: '',
  content: '',
  courseId: props.courseId
})
// 新建公告api
const {
  run: runInsertCourseAnnouncement,
  loading: loadingInsertCourseAnnouncement,
  error: errorInsertCourseAnnouncement
} = useRequest(apiInsertCourseAnnouncement)
// 新建公告
const handleInsertCourseAnnouncement = async () => {
  // 先上传文件
  if (insertFileList.value.length > 0) {
    const formData = new FormData()
    formData.append('file', insertFileList.value[0] as any)
    await runUpload(formData)
    if (errorInsertCourseAnnouncement.value) {
      return
    }
    insertAnnouncementState.attachmentFileId = dataUpload.value!.fileId
  }
  await runInsertCourseAnnouncement(insertAnnouncementState)
  if (errorInsertCourseAnnouncement.value) {
    return
  }
  await refreshCourseAnnouncement()
  visibleInsertModal.value = false
}

// 插入前操作
const insertBeforeUpload = (file: IFileItem) => {
  insertFileList.value = [file]
  return beforeUpload(file)
}

const updateBeforeUpload = (file: IFileItem) => {
  insertFileList.value = [file]
  return beforeUpload(file)
}
const style = useCssModule()
</script>

<style lang="scss" module>
.insertDiv {
  display: flex;
  padding-left: 24px;
  margin-bottom: 16px;
}

.updateBtu {
  color: gray;
  margin-left: -15px;
}
</style>
