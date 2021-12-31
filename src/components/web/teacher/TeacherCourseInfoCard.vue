<template>
  <course-info-card
      :course-info="dataCourseDetail"
      :loading="loadingCourseDetail">
    <template #action>
      <edit-outlined @click="handleShowModalUpdateCourse"/>
    </template>
  </course-info-card>
  <a-modal
      v-model:visible="visibleModalUpdateCourse"
      width="800px"
      :footer="null">
    <update-course-form :course-id="courseId" @finish="handleFinishUpdateCourse"/>
  </a-modal>
</template>

<script lang="ts" setup>
import CourseInfoCard from '../CourseInfoCard.vue'
import { useRequest } from 'vue-request'
import { apiGetCourseDetail } from '../../../api/web/course'
import { EditOutlined } from '@ant-design/icons-vue'
import UpdateCourseForm from './UpdateCourseForm.vue'
import { ref } from 'vue'
// eslint-disable-next-line no-undef
const props = defineProps<{
  courseId: number
}>()

// 获取课程详情
const {
  data: dataCourseDetail,
  loading: loadingCourseDetail,
  refresh: refreshCourseDetail
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

const handleFinishUpdateCourse = (res: boolean) => {
  if (res) {
    refreshCourseDetail()
  }
  visibleModalUpdateCourse.value = false
}

</script>

<style scoped>

</style>
