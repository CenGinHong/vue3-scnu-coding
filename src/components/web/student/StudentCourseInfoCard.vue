<template>
  <course-info-card
      :course-info="dataCourseDetail"
      :loading="loadingCourseDetail">
    <template #action>
      <user-outlined/>
    </template>
  </course-info-card>
</template>

<script lang="ts" setup>
import CourseInfoCard from '../CourseInfoCard.vue'
import { useRequest } from 'vue-request'
import { apiGetCourseDetail } from '../../../api/web/course'
import { ref } from 'vue'
import { UserOutlined } from '@ant-design/icons-vue'
// eslint-disable-next-line no-undef
const props = defineProps<{
  courseId: number
}>()

// 获取课程详情
const {
  data: dataCourseDetail,
  loading: loadingCourseDetail
} = useRequest(apiGetCourseDetail, {
  manual: false,
  defaultParams: [Number(props.courseId)],
  formatResult: (res) => {
    return res.data.result
  }
})

const visibleModalUpdateCourse = ref<boolean>(false)

const handleShowModalUpdateCourse = () => {
  visibleModalUpdateCourse.value = true
}

</script>
