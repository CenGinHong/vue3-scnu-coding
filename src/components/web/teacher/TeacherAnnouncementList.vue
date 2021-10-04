<template>
  <div :class="style.insertDiv">
    <a-button type="primary" @click="visibleInsertModal=true">
      <form-outlined/>
      新建公告
    </a-button>
  </div>
  <base-course-announcement-list
      :data-course="dataCourseAnnouncement?.records"
      :loading="loadingCourseAnnouncement"
      :pag="pag"
  >
    <template #actions="{ item }">
      <a-button
          :class="style.updateBtu"
          type="link"
          @click="handleShowModalUpdateAnnouncement(item)"
      >
        <edit-outlined/>
        修改
      </a-button>
      <a-button
          danger
          type="link"
          @click="handleDeleteCourseAnnouncement(item.courseAnnouncementId)"
      >
        <delete-outlined/>
        删除
      </a-button>
    </template>
  </base-course-announcement-list>

  <insert-course-announcement-modal
      v-model:visible="visibleInsertModal"
      :course-id="courseId"
      @refresh-list="refreshCourseAnnouncement">
  </insert-course-announcement-modal>
  <update-course-announcement-modal
      :update-course-announcement-init-state="updateCourseAnnouncementState"
      v-model:visible="visibleUpdateModal"
      @refresh-list="refreshCourseAnnouncement">
  </update-course-announcement-modal>
</template>

<script lang="ts" setup>
import { computed, createVNode, reactive, ref, useCssModule } from 'vue'
import BaseCourseAnnouncementList from '../BaseCourseAnnouncementList.vue'
import { usePagination, useRequest } from 'vue-request'
import {
  apiDeleteCourseAnnouncement,
  apiListCourseAnnouncement
} from '../../../api/web/courseAnnouncement'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  FormOutlined,
  UploadOutlined,
  LinkedinOutlined
} from '@ant-design/icons-vue'
import {
  courseAnnouncementListResp
} from '../../../api/web/model/courseAnnouncement'
import { Modal } from 'ant-design-vue'
import { fileSrc2File } from '../../../util/utils'
import InsertCourseAnnouncementModal from './InsertCourseAnnouncementModal.vue'
import dayjs from 'dayjs'
import UpdateCourseAnnouncementModal from './UpdateCourseAnnouncementModal.vue'

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
    res.data.result!.records.forEach((item: courseAnnouncementListResp) => {
      item.fileList = []
      if (item.attachmentSrc !== '') {
        item.fileList.push(fileSrc2File(item.attachmentSrc))
      }
    })
    return res.data.result
  },
  defaultParams: [
    {
      courseId: props.courseId
    }
  ]
})

// 分页数据
const pag = computed(() => ({
  onChange: (page: number) => {
    current.value = page
  },
  total: total.value,
  pageSize: pageSize.value
}))

// 可见更新框
const visibleUpdateModal = ref<boolean>(false)

const updateCourseAnnouncementState = reactive<courseAnnouncementListResp>({
  courseAnnouncementId: 0,
  title: '',
  content: '',
  attachmentSrc: '',
  updatedAt: dayjs(),
  fileList: []
})

// 更新框可见方法
const handleShowModalUpdateAnnouncement = (
  item: courseAnnouncementListResp
) => {
  updateCourseAnnouncementState.courseAnnouncementId = item.courseAnnouncementId
  updateCourseAnnouncementState.title = item.title
  updateCourseAnnouncementState.content = item.content
  updateCourseAnnouncementState.fileList = item.fileList
  visibleUpdateModal.value = true
}

// 删除
const {
  run: runDeleteCourseAnnouncement,
  loading: loadingDeleteCourseAnnouncement,
  error: errorDeleteCourseAnnouncement
} = useRequest(apiDeleteCourseAnnouncement)

// 删除公告
const handleDeleteCourseAnnouncement = (courseAnnouncementId: number) => {
  Modal.confirm({
    title: () => '您确认要删除该公告吗',
    icon: () => createVNode(ExclamationCircleOutlined),
    content: () => '删除不可挽回，请确认',
    onOk: async() => {
      await runDeleteCourseAnnouncement({ id: courseAnnouncementId })
      if (errorDeleteCourseAnnouncement.value) {
        return
      }
      await refreshCourseAnnouncement()
    },
    onCancel() {
    },
    okButtonProps: {
      loading: loadingDeleteCourseAnnouncement.value,
      danger: true
    },
    okText: () => '确认删除',
    cancelText: () => '取消'
  })
}

// 插入框可见
const visibleInsertModal = ref<boolean>(false)

const style = useCssModule()
</script>

<style lang="scss" module>

.updateBtu {
  color: gray;
  margin-left: -15px;
}
</style>
