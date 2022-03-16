<template>
  <a-row class="row1">
    <a-col :span="20" :offset="2" class="col1">
      <a-tabs
          v-model:activeKey="tabsActiveKey"
          size="large"
      >
        <a-tab-pane key="1" tab="课程详情">
          <teacher-course-info :course-id="Number(courseId)"/>
        </a-tab-pane>
        <a-tab-pane key="2" tab="课程实验">
          <teacher-lab-list :course-id="Number(courseId)"/>
        </a-tab-pane>
        <a-tab-pane key="3" tab="课程公告">
          <teacher-announcement-list :course-id="Number(courseId)"/>
        </a-tab-pane>
        <a-tab-pane key="4" tab="课程讨论">
          <course-comment :course-id="Number(courseId)"/>
        </a-tab-pane>
        <a-tab-pane key="5" tab="课程签到">
          <teacher-checkin-table :course-id="Number(courseId)"/>
        </a-tab-pane>
        <a-tab-pane key="6" tab="学生管理">
          <teacher-course-overview-table :course-id="Number(courseId)"/>
        </a-tab-pane>
      </a-tabs>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import TeacherLabList from '../../components/web/teacher/TeacherLabList.vue'
import TeacherCheckinTable from '../../components/web/teacher/TeacherCheckinTable.vue'
import CourseComment from '../../components/web/CourseComment.vue'
import TeacherAnnouncementList from '../../components/web/teacher/TeacherAnnouncementList.vue'
import 'vue-cropper/dist/index.css'
import TeacherCourseOverviewTable from '../../components/web/teacher/TeacherCourseOverviewTable.vue'
import { EditOutlined } from '@ant-design/icons-vue'
import TeacherCourseInfo from '../../components/web/teacher/TeacherCourseInfo.vue'
// eslint-disable-next-line no-undef
const props = defineProps<{
  courseId: string
}>()

// 课程更新窗口是否可见
const visibleModalUpdateCourse = ref<boolean>(false)

const tabsActiveKey = ref<string>('2')
</script>

<style lang="scss" scoped>

.row1 {
  margin-top: 24px;

  .col1 {
    border-radius: 8px;
    background-color: white;
    padding: 16px 16px 16px 16px;
  }

  .col2 {
    border-radius: 8px;
  }

  .antTabs {
    padding-top: 16px;
    margin: 0;
  }
}
</style>
