<template>
  <a-row class="row1">
    <a-skeleton :loading="loadingCourseDetail">
      <a-col :span="9">
        <a-image
            src="/src/assets/gate.jpg"
            fallback="https://via.placeholder.com/240x135?text=%E5%8A%A0%E8%BD%BD%E5%A4%B1%E8%B4%A5"
        />
      </a-col>
      <a-col :span="14" :offset="1" style="text-align: left" >
        <div >
          <h1>
            {{ dataCourseDetail?.courseName }}
            <a-tag v-if="dataCourseDetail?.isClose" color="success">进行中</a-tag>
            <a-tag v-else color="default">已结课</a-tag>

          </h1>
        </div>
        <p>
          授课教师： <a>{{ dataCourseDetail?.teacherDetail.username }}</a>
        </p>
        <p>
          {{ dataCourseDetail?.courseDes }}
        </p>
        <slot name="actions"></slot>
      </a-col>
    </a-skeleton>
  </a-row>
</template>

<script lang="ts" setup>

import { useRequest } from 'vue-request'
import { apiGetCourseDetail } from '../../api/web/course'
// eslint-disable-next-line no-undef
const props = defineProps<{
  courseId: number
}>()

const { data: dataCourseDetail, loading: loadingCourseDetail } = useRequest(
  apiGetCourseDetail,
  {
    manual: false,
    defaultParams: [Number(props.courseId)],
    formatResult: (res) => {
      return res.data.result
    }
  }
)

</script>

<style lang="scss" scoped>
.row1 {
  margin-top: 24px;
}
</style>
