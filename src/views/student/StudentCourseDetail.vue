<template>
  <a-row class="row1">
    <a-col class="col1" :span="20" :offset="2">
      <a-tabs
          v-model:activeKey="tabsActiveKey"
          size="large"
      >
        <a-tab-pane key="1" tab="课程信息">
          <div class="courseInfo">
            <course-info :course-id="Number(props.courseId)" />
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="课程实验">
          <student-lab-list :course-id="props.courseId"/>
        </a-tab-pane>
        <a-tab-pane key="3" tab="课程讨论">
          <div class="contentPadding">
            <course-comment :course-id="Number(props.courseId)"/>
          </div>
        </a-tab-pane>
        <a-tab-pane key="4" tab="课程签到">
          <div class="contentPadding">
            <student-checkin-table :course-id="Number(courseId)"/>
          </div>
        </a-tab-pane>
        <a-tab-pane key="5" tab="课程公告">
          <student-announcement-list :course-id="Number(courseId)"/>
        </a-tab-pane>
      </a-tabs>
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
import CourseInfo from '../../components/web/CourseInfo.vue'

// eslint-disable-next-line no-undef
const props = defineProps<{
  courseId: string
}>()

const tabsActiveKey = ref<string>('2')
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

.courseInfo {
  margin: 0 16px 0 16px;
}

::v-deep(.ant-tabs-nav-wrap) {
  margin-left: 16px;
}
</style>
