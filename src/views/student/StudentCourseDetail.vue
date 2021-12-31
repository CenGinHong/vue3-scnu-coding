<template>
  <a-row class="row1">
    <a-col class="col1" :span="15" :offset="1">
      <a-tabs
          v-model:activeKey="tabsActiveKey"
          size="large"
      >
        <a-tab-pane key="1" tab="课程实验">
          <student-lab-list :course-id="props.courseId"/>
        </a-tab-pane>
        <a-tab-pane key="2" tab="课程评论">
          <div class="contentPadding">
            <course-comment :course-id="Number(props.courseId)"/>
          </div>
        </a-tab-pane>
        <a-tab-pane key="3" tab="课程签到">
          <div class="contentPadding">
            <student-checkin-table :course-id="Number(courseId)"/>
          </div>
        </a-tab-pane>
        <a-tab-pane key="4" tab="课程公告">
          <student-announcement-list :course-id="Number(courseId)"/>
        </a-tab-pane>
      </a-tabs>
    </a-col>
    <a-col class="teacherDetail" :span="6" :offset="1">
      <student-course-info-card :course-id="Number(courseId)"/>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import StudentCheckinTable from '../../components/web/student/StudentCheckinTable.vue'
import CourseComment from '../../components/web/CourseComment.vue'
import StudentLabList from '../../components/web/student/StudentLabList.vue'
import { useRequest } from 'vue-request'
import { apiGetCourseDetail } from '../../api/web/course'
import StudentAnnouncementList from '../../components/web/student/StudentAnnouncementList.vue'
import StudentCourseInfoCard from '../../components/web/student/StudentCourseInfoCard.vue'

// eslint-disable-next-line no-undef
const props = defineProps<{
  courseId: string
}>()

const tabsActiveKey = ref<string>('1')
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
  margin-top: 20px;
  min-height: 200px;

  .col1 {
    background-color: white;
    border-radius: 8px;
    padding: 10px 10px 10px 10px;

  }
}

.row2 {
  margin-left: 100px;
  margin-right: 100px;
  margin-top: 36px;

  .courseList {
    background-color: white;
    border-radius: 8px;
    transition: box-shadow 0.3s;
    padding: 0 16px 0 16px;
  }

  .teacherDetail {
    height: fit-content;
  }
}

.contentPadding {
  padding-left: 24px;
  padding-right: 24px;
}

::v-deep(.ant-tabs-nav-wrap) {
  margin-left: 16px;
}
</style>
