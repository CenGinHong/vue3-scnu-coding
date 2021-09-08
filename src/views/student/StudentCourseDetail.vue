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
                <template v-if="dataCourseDetail?.isClose">
                  <a-tag :class="style.tag" color="success">进行中</a-tag>
                </template>
                <template v-else>
                  <a-tag :class="style.tag" color="default">已结课</a-tag>
                </template>
              </h1>
              <p>{{ dataCourseDetail?.courseDes }}</p>
            </div>
          </a-col>
        </a-row>
      </template>
    </a-col>
  </a-row>
  <a-row :class="style.row2">
    <a-col :class="style.courseList" span=17>
      <a-tabs v-model:activeKey="tabsActiveKey" :class="style.antTabs" size="large">
        <a-tab-pane key="1" tab="课程实验">
          <student-lab-list :course-id="props.courseId" />
        </a-tab-pane>
        <a-tab-pane key="2" tab="课程评论">
          <div :class="style.contentPadding">
            <course-comment :course-id="Number(props.courseId)"/>
          </div>
        </a-tab-pane>
        <!--<a-tab-pane key="3" tab="课程签到">-->
        <!--  <div :class="style.contentPadding">-->
        <!--    <student-checkin-table/>-->
        <!--  </div>-->
        <!--</a-tab-pane>-->
        <!--<a-tab-pane key="4" tab="课程公告">-->
        <!--  <div :class="style.contentPadding">-->
        <!--    <course-announcement-list :data-course-announcement="dataCourseAnnouncement"-->
        <!--                              :loading="loadingCourseAnnouncement" :pagination="pagination"/>-->
        <!--  </div>-->
        <!--</a-tab-pane>-->
      </a-tabs>
    </a-col>
    <a-col span=1>
    </a-col>
    <a-col :class="style.teacherDetail" span=6>
      <a-card>
        <template #cover>
          <img
              alt="example"
              src="/src/assets/school.jpg"
          />
        </template>
        <a-card-meta :title=dataCourseDetail?.teacherDetail.username>
          <template #avatar>
            <a-avatar :src="dataCourseDetail?.teacherDetail.avatarUrl"/>
          </template>
          <template #description>
            <h4>{{ dataCourseDetail?.teacherDetail.organization }}</h4>
            <h4>{{ dataCourseDetail?.teacherDetail.email }}</h4>
          </template>
        </a-card-meta>
      </a-card>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
import { computed, defineComponent, ref, useCssModule } from 'vue'
import StudentCheckinTable from '../../components/web/student/StudentCheckinTable.vue'
import CourseComment from '../../components/web/CourseComment.vue'
import StudentLabList from '../../components/web/student/StudentLabList.vue'
import { usePagination, useRequest } from 'vue-request'
import { apiGetCourseDetail, apiGetIsCourseEnroll } from '../../api/web/course'
import { apiListCourseAnnouncement } from '../../api/web/courseAnnouncement'
import { pagination } from '../../api/common'
import { message } from 'ant-design-vue'

// eslint-disable-next-line no-undef
const props = defineProps<{
  courseId: string
}>()

const tabsActiveKey = ref<string>('1')
const { data: dataCourseDetail, loading: loadingCourseDetail } = useRequest(apiGetCourseDetail, {
  manual: false,
  defaultParams: [
    Number(props.courseId)
  ],
  formatResult: (res) => {
    return res.data.result
  }
})

const {
  data: dataCourseAnnouncement,
  loading: loadingCourseAnnouncement,
  pageSize,
  current,
  total
} = usePagination(apiListCourseAnnouncement, {
  manual: false,
  formatResult: (res) => {
    return res.data.result
  },
  defaultParams: [
    {
      courseId: Number(props.courseId)
    }
  ]
})

// 分页数据
const pag = computed<pagination>(() => ({
  onChange: (page: number) => {
    current.value = page
  },
  total: total.value,
  pageSize: pageSize.value
}))

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

.courseList:hover {
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.25);
}

.teacherDetail:hover {
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.25);
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

::v-deep(.ant-tabs-nav-scroll) {
  display: flex;
  margin-left: 20px;
}
</style>

<style lang="scss" scoped>
::v-deep(.ant-tabs-nav-container) {
  display: flex;
  margin-left: 16px;
  margin-top: 16px;
}
</style>
