<template>
  <a-row :class="style.row1">
    <a-col :class="style.courseInfo" span="24">
      <template v-if="loadingCourseDetail">
        <a-skeleton active/>
      </template>
      <template v-else>
        <a-row align="top">
          <a-col :span="7">
            <img :class="style.courseCover"
                 :src="dataCourseDetail?.coverUrl">
          </a-col>
          <a-col :span="17">
            <div :class="style.textArea">
              <h1 :class="style.title">
                {{ dataCourseDetail?.courseName }}
                <a-tag :class="style.tag" :color="dataCourseDetail?.isClose?'success':'default'">
                  {{ dataCourseDetail?.isClose ? '进行中' : '已结课' }}
                </a-tag>
              </h1>
              <p :class="style.courseDes">{{ dataCourseDetail?.courseDes }}</p>
            </div>
          </a-col>
        </a-row>
      </template>
    </a-col>
  </a-row>
  <a-row :class="style.functionalArea">
    <a-col span="24">
      <a-tabs v-model:activeKey="tabsActiveKey" :class="style.antTabs" size="large">
        <a-tab-pane key="1" tab="课程实验">
          <teacher-lab-list :course-id="Number(courseId)"/>
        </a-tab-pane>
        <a-tab-pane key="2" tab="课程公告">
          <teacher-announcement-list :course-id="Number(courseId)"/>
        </a-tab-pane>
        <a-tab-pane key="3" tab="课程评论">
          <div :class="style.contentPadding" >
            <course-comment :course-id="Number(courseId)" />
          </div>
        </a-tab-pane>
        <a-tab-pane key="4" tab="课程签到">
          <div :class="style.contentPadding">
            <teacher-checkin-table :course-id="Number(courseId)"/>
          </div>
        </a-tab-pane>
        <a-tab-pane key="5" tab="学生管理">
          <div :class="style.contentPadding">
            <teacher-course-manage-table :course-id="Number(courseId)"/>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
import { ref, useCssModule } from 'vue'

import { useRoute } from 'vue-router'
import TeacherLabList from '../../components/web/teacher/TeacherLabList.vue'
import TeacherCheckinTable from '../../components/web/teacher/TeacherCheckinTable.vue'
import CourseComment from '../../components/web/CourseComment.vue'
import TeacherAnnouncementList from '../../components/web/teacher/TeacherAnnouncementList.vue'
import { useRequest } from 'vue-request'
import { apiGetCourseDetail } from '../../api/web/course'
import TeacherCourseManageTable from '../../components/web/teacher/TeacherCourseManageTable.vue'
import { EditOutlined } from '@ant-design/icons-vue'

// eslint-disable-next-line no-undef
const props = defineProps<{
  courseId: string
}>()

const tabsActiveKey = ref<string>('1')
const route = useRoute()
const { data: dataCourseDetail, loading: loadingCourseDetail } = useRequest(apiGetCourseDetail, {
  manual: false,
  defaultParams: [
    Number(props.courseId)
  ],
  formatResult: (res) => {
    return res.data.result
  }
})

const style = useCssModule()

</script>

<style lang="scss" module>

.courseInfo:hover {
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.25);
}

.row1 {
  margin-left: 100px;
  margin-right: 100px;
  margin-top: 20px;
  min-height: 200px;

  .courseInfo {
    background-color: white;
    border-radius: 8px;
    padding: 20px 20px 20px 20px;
    transition: box-shadow 0.3s;

    .courseCover {
      height: 153px;
      width: 272px;
    }

    .textArea {
      text-align: left;
      margin-left: 20px;

      .title {
        font-size: 22px;
        font-weight: bold;

        .tag {
          margin-left: 10px;
          margin-bottom: 5px;
        }
      }
    }
  }
}

.functionalArea:hover {
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.25);
}

.functionalArea {
  margin-left: 100px;
  margin-right: 100px;
  margin-top: 20px;
  border-radius: 8px;
  background-color: white;
  transition: box-shadow 0.3s;
  padding-left: 24px;
  padding-right: 24px;
  padding-bottom: 16px;

  .antTabs {
    padding-top: 16px;
    margin: 0;
  }

  .contentPadding {
    padding-left: 24px;
    padding-right: 24px;
  }

}
</style>

<style lang="scss" scoped>
::v-deep(.ant-tabs-nav-wrap) {
  display: flex;
  margin-left: 16px;
}
</style>
