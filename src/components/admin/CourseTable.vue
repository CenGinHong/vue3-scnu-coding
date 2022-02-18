<template>
  <a-table
      :columns="columns"
      :data-source="dataAllCourse?.records"
      :loading="loadingAllCourse"
      :pagination="pagCourseList"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'updatedAt'">
        {{ dayjs(record.updatedAt).format('YYYY-MM-DD') }}
      </template>
      <template v-if="column.dataIndex === 'isClose'">
        <template v-if="record.isClose">
          <a-tag color="default">已结课</a-tag>
        </template>
        <template v-else>
          <a-tag color="success">进行中</a-tag>
        </template>
      </template>
      <template v-if="column.key === 'operation'">
        <a-space>
          <a-tooltip title="编辑">
            <a @click="handleShowUpdateCourseModal(record.courseId)">
              <edit-outlined/>
            </a>
          </a-tooltip>
          <a-tooltip title="选课">
            <a @click="handleShowCourseEnroll(record.courseId)">
              <team-outlined/>
            </a>
          </a-tooltip>
          <a-tooltip title="讨论">
            <a @click="handleShowDrawerComment(record.courseId)">
              <comment-outlined/>
            </a>
          </a-tooltip>
        </a-space>
      </template>
    </template>
  </a-table>
  <a-modal
      title="修改课程"
      :width="720"
      :destroy-on-close="true"
      :footer="null"
      v-model:visible="visibleModalUpdateCourse"
  >
    <update-course-form :course-id="selectedCourseId"/>
  </a-modal>
  <!--  <a-modal-->
  <!--    v-model:visible="visibleEnrollTable"-->
  <!--    width="1200px"-->
  <!--    :destroyOnClose="true"-->
  <!--    :footer="null"-->
  <!--  >-->
  <!--    <course-enroll-table :course-id="EnrollTableCourseId">-->
  <!--    </course-enroll-table>-->
  <!--  </a-modal> -->
  <a-modal
      title="选课记录"
      :width="1020"
      :footer="null"
      :destroy-on-close="true"
      v-model:visible="visibleModalCourseEnroll"
  >
    <course-enroll-table :course-id="selectedCourseId"/>
  </a-modal>
  <a-modal
      title="讨论列表"
      :width="1020"
      :footer="null"
      :destroy-on-close="true"
      v-model:visible="visibleDrawerComment">
      <course-comment :course-id="selectedCourseId"/>
  </a-modal>
</template>

<script lang="ts" setup>
import { usePagination } from 'vue-request'
import { apiListAllCourse } from '../../api/admin/course'
import { IFileItem } from '../../api/common'
import dayjs from 'dayjs'
import { computed, reactive, ref } from 'vue'
import { ColumnType } from 'ant-design-vue/es/table'
import { RuleObject } from 'ant-design-vue/es/form/interface'
import { useRouter } from 'vue-router'
import { EditOutlined, BarsOutlined, TeamOutlined, CommentOutlined } from '@ant-design/icons-vue'
import CourseEnrollTable from './CourseEnrollTable.vue'
import CourseComment from '../web/CourseComment.vue'
import UpdateCourseForm from '../web/teacher/UpdateCourseForm.vue'

const router = useRouter()

// 获取全部列表
const {
  data: dataAllCourse,
  loading: loadingAllCourse,
  pageSize: pageSizeAllCourse,
  total: totalAllCourse,
  current: currentAllCourse,
  refresh: refreshAllCourse
} = usePagination(apiListAllCourse, {
  manual: false,
  formatResult: (res) => {
    return res.data.result
  }
})

const pagCourseList = computed(() => ({
  onChange: (page: number) => {
    currentAllCourse.value = page
  },
  total: totalAllCourse.value,
  pageSize: pageSizeAllCourse.value
}))

const columns: ColumnType[] = [
  {
    title: '课程名称',
    dataIndex: 'courseName',
    width: '10%'
  },
  {
    title: '开课教师',
    dataIndex: ['teacherDetail', 'username'],
    width: '8%'
  },
  {
    title: '课程描述',
    dataIndex: 'courseDes',
    ellipsis: true,
    width: '20%'
  },
  {
    title: '课程密钥',
    dataIndex: 'secretKey',
    width: '6%'
  },
  {
    title: '是否结课',
    dataIndex: 'isClose',
    width: '6%'
  },
  {
    title: '语言类型',
    dataIndex: 'languageType',
    width: '6%'
  },
  {
    title: '创建时间',
    dataIndex: 'updatedAt',
    width: '8%'
  },
  {
    title: '操作',
    key: 'operation',
    width: '10%'
  }
]

// 表单字段规则
const rules = reactive<Record<string, RuleObject[]>>({
  courseName: [
    {
      required: true,
      message: '请输入课程名'
    },
    {
      max: 16,
      message: '课程名最长16字'
    }
  ],
  courseDes: [{
    required: true,
    message: '请输入课程描述'
  }],
  secretKey: [{
    pattern: /^\d{6}$/,
    message: '需为6位数字'
  }]
})

// 语言单选选项
const languageEnumRadioOption = [
  {
    label: 'Cpp',
    value: 1
  },
  {
    label: 'Java',
    value: 2
  },
  {
    label: 'Python',
    value: 3
  }
]

const updateCourseImageInitList = ref<IFileItem[]>([])

const handleShowUpdateCourseModal = (courseId: number) => {
  selectedCourseId.value = courseId
  visibleModalUpdateCourse.value = true
}

const visibleModalUpdateCourse = ref<boolean>(false)

const handleVisibleDrawer = (courseId: number) => {
  selectedCourseId.value = courseId
  visibleModalUpdateCourse.value = true
}

const visibleModalCourseEnroll = ref<boolean>(false)
const selectedCourseId = ref<number>(0)

const handleShowCourseEnroll = (courseId: number) => {
  selectedCourseId.value = courseId
  visibleModalCourseEnroll.value = true
}

const visibleDrawerComment = ref<boolean>(false)

const handleShowDrawerComment = (courseId: number) => {
  selectedCourseId.value = courseId
  visibleDrawerComment.value = true
}

</script>

<style lang="scss" scoped></style>
