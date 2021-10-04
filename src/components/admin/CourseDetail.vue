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
      <template v-if="column.dataIndex === 'courseDes'">
        <a-tooltip :title="record.courseDes">
          {{ record.courseDes }}
        </a-tooltip>
      </template>
      <template v-if="column.dataIndex === 'other'">
        <a-space>
          <a @click="handleShowEnrollTableModal(record.courseId)">选课记录</a>
          <a>讨论</a>
        </a-space>
      </template>
      <template v-if="column.dataIndex === 'modify'">
        <a @click="handleShowUpdateCourseModal(record)">修改</a>
      </template>
    </template>
  </a-table>
  <a-modal
    v-model:visible="visibleModalUpdateCourse"
    :ok-button-props="{ loading: loadingUpdateCourse || loadingUpload }"
    :disable="loadingUpload"
    cancel-text="取消"
    ok-text="修改"
    width="800px"
    @ok="handleUpdateCourse"
  >
    <a-form
      :label-col="{ span: 3 }"
      :model="updateCourseState"
      :rules="rules"
      :wrapper-col="{ span: 20 }"
    >
      <a-form-item label="课程名称" name="courseName">
        <a-input v-model:value="updateCourseState.courseName" />
      </a-form-item>
      <a-form-item label="课程描述" name="courseDes">
        <a-textarea
          v-model:value="updateCourseState.courseDes"
          :maxlength="250"
          allow-clear
          rows="5"
          showCount
        />
      </a-form-item>
      <a-form-item label="课程密钥" name="secretKey">
        <a-input v-model:value="updateCourseState.secretKey" />
      </a-form-item>
      <a-form-item label="编程语言">
        <a-radio-group
          :options="languageEnumRadioOption"
          v-model:value="updateCourseState.languageType"
        ></a-radio-group>
      </a-form-item>
      <a-form-item label="是否结课">
        <a-switch v-model:checked="updateCourseState.isClose" />
      </a-form-item>
      <a-form-item label="课程封面">
        <upload-image-modal
          v-model:image-init-list="updateCourseImageInitList"
          v-model:loading="loadingUpload"
          :size-limits="2"
        />
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal
    v-model:visible="visibleEnrollTable"
    width="1200px"
    :destroyOnClose="true"
    :footer="null"
  >
    <course-enroll-table :course-id="EnrollTableCourseId">
    </course-enroll-table>
  </a-modal>
</template>

<script lang="ts" setup>
import { usePagination, useRequest } from 'vue-request'
import { apiListAllCourse, apiUpdateCourse } from '../../api/admin/course'
import { columnType, IFileItem } from '../../api/common'
import dayjs from 'dayjs'
import { computed, reactive, ref, watchEffect } from 'vue'
import UploadImageModal from '../common/UploadImageModal.vue'
import {
  listCourseResp,
  updateCourseReq
} from '../../api/admin/model/courseModel'
import { fileSrc2File } from '../../util/utils'
import { apiChangeLabFinish } from '../../api/web/labSubmit'
import CourseEnrollTable from './CourseEnrollTable.vue'

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

const columns: columnType[] = [
  {
    title: '课程名称',
    dataIndex: 'courseName'
  },
  {
    title: '开课教师',
    dataIndex: ['teacherDetail', 'username']
  },
  {
    title: '课程描述',
    dataIndex: 'courseDes',
    ellipsis: true
  },
  {
    title: '课程密钥',
    dataIndex: 'secretKey'
  },
  {
    title: '是否结课',
    dataIndex: 'isClose'
  },
  {
    title: '语言类型',
    dataIndex: 'languageType'
  },
  {
    title: '创建时间',
    dataIndex: 'updatedAt'
  },
  {
    title: '其他',
    dataIndex: 'other'
  },
  {
    title: '修改',
    dataIndex: 'modify'
  }
]

// 表单字段规则
const rules = reactive({
  courseName: [
    { required: true, message: '请输入课程名' },
    { max: 16, message: '课程名最长16字' }
  ],
  courseDes: [{ required: true, message: '请输入课程描述' }],
  secretKey: [{ pattern: /^\d{6}$/, message: '需为6位数字' }]
})

// 语言单选选项
const languageEnumRadioOption = [
  { label: 'Cpp', value: 1 },
  { label: 'Java', value: 2 },
  { label: 'Python', value: 3 }
]

const updateCourseImageInitList = ref<IFileItem[]>([])

const handleShowUpdateCourseModal = (record: listCourseResp) => {
  updateCourseState.courseId = record.courseId
  updateCourseState.courseName = record.courseName
  updateCourseState.courseDes = record.courseDes
  updateCourseState.isClose = record.isClose
  updateCourseState.secretKey = record.secretKey
  updateCourseState.languageType = record.languageType
  // 注意这下面两句不能调换，否则不能正确监听图片的变化
  if (record.coverImg !== '') {
    updateCourseImageInitList.value = [fileSrc2File(record.coverImg)]
  }
  updateCourseState.coverImg = undefined
  visibleModalUpdateCourse.value = true
}

const updateCourseState = reactive<updateCourseReq>({
  courseId: 0,
  courseName: '',
  courseDes: '',
  secretKey: '',
  languageType: 1,
  isClose: false
})

// 上传loading
const loadingUpload = ref<boolean>(false)

// 监听图片回调
watchEffect(() => {
  // 当图片被移除的时候
  if (updateCourseImageInitList.value.length === 0) {
    updateCourseState.coverImg = ''
    return
  }
  // 当有图片上传完成
  if (updateCourseImageInitList.value[0].status === 'done') {
    updateCourseState.coverImg =
      updateCourseImageInitList.value[0].response!.result!.fileSrc
  }
})

const visibleModalUpdateCourse = ref<boolean>(false)

const {
  run: runUpdateCourse,
  loading: loadingUpdateCourse,
  error: errUpdateCourse
} = useRequest(apiUpdateCourse)
const handleUpdateCourse = async() => {
  await runUpdateCourse(updateCourseState)
  if (errUpdateCourse.value) {
    return
  }
  visibleModalUpdateCourse.value = false
  await refreshAllCourse()
}

const visibleEnrollTable = ref<boolean>(false)
const EnrollTableCourseId = ref<number>(0)
const handleShowEnrollTableModal = (courseId: number) => {
  EnrollTableCourseId.value = courseId
  visibleEnrollTable.value = true
}
</script>

<style lang="scss" scoped></style>
