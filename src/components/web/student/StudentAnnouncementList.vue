<template>
  <base-course-announcement-list
    :data-course="dataCourseAnnouncement?.records"
    :loading="loadingCourseAnnouncement"
    :pag="pag"
  >
  </base-course-announcement-list>
</template>

<script lang="ts" setup>
import BaseCourseAnnouncementList from '../BaseCourseAnnouncementList.vue'
import { usePagination } from 'vue-request'
import { apiListCourseAnnouncement } from '../../../api/web/courseAnnouncement'
import { courseAnnouncementDetailResp } from '../../../api/web/model/courseAnnouncement'
import { fileSrc2File } from '../../../util/utils'
import { computed } from 'vue'
import { TablePaginationConfig } from 'ant-design-vue/es/table/Table'

// eslint-disable-next-line no-undef
const props = defineProps<{
  courseId: number
}>()

// 获取公告列表
const {
  data: dataCourseAnnouncement,
  loading: loadingCourseAnnouncement,
  pageSize,
  current,
  total
} = usePagination(apiListCourseAnnouncement, {
  manual: false,
  formatResult: (res) => {
    res.data.result?.records.forEach((item: courseAnnouncementDetailResp) => {
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
const pag = computed<TablePaginationConfig>(() => ({
  onChange: (page: number) => {
    current.value = page
  },
  total: total.value,
  pageSize: pageSize.value
}))
</script>

<style lang="scss" scoped></style>
