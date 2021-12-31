<template>
  <a-row class="row1">
    <a-col :span="15" :offset="1">
      <a-tabs
          v-model:activeKey="tabsActiveKey"
          class="col1"
          size="large"
      >
        <a-tab-pane key="1" tab="课程实验">
          <teacher-lab-list :course-id="Number(courseId)"/>
        </a-tab-pane>
        <a-tab-pane key="2" tab="课程公告">
          <teacher-announcement-list :course-id="Number(courseId)"/>
        </a-tab-pane>
        <a-tab-pane key="3" tab="课程评论">
          <div class="contentPadding">
            <course-comment :course-id="Number(courseId)"/>
          </div>
        </a-tab-pane>
        <a-tab-pane key="4" tab="课程签到">
          <div class="contentPadding">
            <teacher-checkin-table :course-id="Number(courseId)"/>
          </div>
        </a-tab-pane>
        <a-tab-pane key="5" tab="学生管理">
          <div class="contentPadding">
            <teacher-course-overview-table :course-id="Number(courseId)"/>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-col>
    <a-col :span="6" :offset="1" class="col2">
      <teacher-course-info-card :course-id="Number(courseId)"/>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import TeacherLabList from '../../components/web/teacher/TeacherLabList.vue'
import TeacherCheckinTable from '../../components/web/teacher/TeacherCheckinTable.vue'
import CourseComment from '../../components/web/CourseComment.vue'
import TeacherAnnouncementList from '../../components/web/teacher/TeacherAnnouncementList.vue'
import 'vue-cropper/dist/index.css'
import TeacherCourseInfoCard from '../../components/web/teacher/TeacherCourseInfoCard.vue'
import TeacherCourseOverviewTable from '../../components/web/teacher/TeacherCourseOverviewTable.vue'

// eslint-disable-next-line no-undef
const props = defineProps<{
  courseId: string
}>()

// 课程更新窗口是否可见
const visibleModalUpdateCourse = ref<boolean>(false)

const tabsActiveKey = ref<string>('1')
const route = useRoute()
</script>

<style lang="scss" scoped>

.row1 {
  margin-top: 20px;

  .col1 {
    border-radius: 8px;
    background-color: white;
    padding: 10px 10px 10px 10px;
  }

  .col2 {
    border-radius: 8px;
  }

  .antTabs {
    padding-top: 16px;
    margin: 0;
  }

  .contentPadding {
    padding-left: 16px;
    padding-right: 16px;
  }
}
</style>

<style lang="scss" scoped>
::v-deep(.ant-tabs-nav-wrap) {
  margin-left: 16px;
}
</style>
