<template>
  <a-space class="btnSpace">
    <a-button type="primary" @click="handleShowModalInsert">
      <form-outlined/>
      新建公告
    </a-button>
    <a-button @click="handleRefresh">
      <reload-outlined/>
      刷新
    </a-button>
  </a-space>
  <base-course-announcement-list
      :data-course="dataCourseAnnouncement?.records"
      :loading="loadingCourseAnnouncement"
      :pag="pag"
  >
    <template #actions="{ item }">
        <a-button
            class="firstBtn"
            type="link"
            @click="handleShowModalUpdate(item.courseAnnouncementId)"
        >
          <edit-outlined/>
          修改
        </a-button>
    </template>
  </base-course-announcement-list>

  <a-modal
      title="新建公告"
      v-model:visible="visibleInsertModal"
      :footer="null"
      width="800px"
      :destroy-on-close="true"
  >
    <insert-course-announcement-form
        :course-id="courseId"
        @finish="handleFinishInsert"/>
  </a-modal>
  <a-modal
      title="修改公告"
      v-model:visible="visibleUpdateModal"
      :footer="null"
      width="800px"
      :destroy-on-close="true"
  >
    <update-course-announcement-modal
        :course-announcement-id="updateCourseAnnouncementId"
        @finish="handleFinishUpdate"
    />
  </a-modal>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import BaseCourseAnnouncementList from '../BaseCourseAnnouncementList.vue'
import { usePagination } from 'vue-request'
import {
  apiListCourseAnnouncement
} from '../../../api/web/courseAnnouncement'
import {
  EditOutlined,
  FormOutlined
  , ReloadOutlined
} from '@ant-design/icons-vue'
import {
  courseAnnouncementDetailResp
} from '../../../api/web/model/courseAnnouncement'
import { message, TablePaginationConfig } from 'ant-design-vue'

import { fileSrc2File } from '../../../util/utils'
import InsertCourseAnnouncementForm from './InsertCourseAnnouncementForm.vue'
import UpdateCourseAnnouncementModal from './UpdateCourseAnnouncementForm.vue'

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
    res.data.result!.records.forEach((item: courseAnnouncementDetailResp) => {
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

const handleRefresh = () => {
  refreshCourseAnnouncement()
}

// 分页数据
const pag = computed<TablePaginationConfig>(() => {
  return {
    onChange: (page: number) => {
      current.value = page
    },
    total: total.value,
    pageSize: pageSize.value
  }
})

// 插入框可见
const visibleInsertModal = ref<boolean>(false)

const handleShowModalInsert = () => {
  visibleInsertModal.value = true
}

const handleFinishInsert = () => {
  visibleInsertModal.value = false
  refreshCourseAnnouncement()
}

const updateCourseAnnouncementId = ref<number>(0)

// 可见更新框
const visibleUpdateModal = ref<boolean>(false)

const handleShowModalUpdate = (id:number) => {
  updateCourseAnnouncementId.value = id
  visibleUpdateModal.value = true
}

const handleFinishUpdate = () => {
  visibleUpdateModal.value = false
  refreshCourseAnnouncement()
}

</script>

<style lang="scss" scoped>
.btnSpace {
  display: flex;
  margin-bottom: 16px;
  margin-left: 16px;
}

.firstBtn {
  margin-left: -15px;
}
</style>
