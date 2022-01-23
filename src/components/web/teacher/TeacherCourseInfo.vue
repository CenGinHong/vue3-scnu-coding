<template>
  <course-info :course-id="props.courseId">
    <template #actions>
      <a-button type="primary" @click="handleShowModalUpdateCourse">
        修改课程
      </a-button>
    </template>
  </course-info>
  <a-modal
      v-model:visible="visibleModalUpdateCourse"
      width="800px"
      :footer="null">
    <update-course-form :course-id="courseId" @finish="handleFinishUpdateCourse"/>
  </a-modal>
</template>

<script lang="ts" setup>
// eslint-disable-next-line no-undef
import CourseInfo from '../CourseInfo.vue'
import { ref } from 'vue'
import UpdateCourseForm from './UpdateCourseForm.vue'

// eslint-disable-next-line no-undef
const props = defineProps<{
  courseId: number
}>()

const visibleModalUpdateCourse = ref<boolean>(false)

const handleShowModalUpdateCourse = () => {
  visibleModalUpdateCourse.value = true
}

const handleFinishUpdateCourse = (res: boolean) => {
  visibleModalUpdateCourse.value = false
}

</script>

<style scoped>

</style>
