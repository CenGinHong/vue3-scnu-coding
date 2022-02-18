<template>
  <a-popover title="Title" trigger="click" placement="left">
    <a-button type="primary">
      导入
    </a-button>
    <template #content>
      <a-space direction="vertical">
        <a-textarea
            v-model:value="importStudentNum"
            placeholder="添加学生：请输入学号，一行一个"
            :auto-size="{ minRows: 3, maxRows: 5 }"
        />
        <a-button type="primary" @click="handleImportStudent" :loading="loadingImportStudent">
          确定
        </a-button>
      </a-space>
    </template>
  </a-popover>
  <a-table
      :columns="columns"
      :data-source="dataCourseEnroll?.records"
      :loading="loadingCourseEnroll"
      :pagination="pag"
      :row-key="record => record.userId"
      @change="handleTableChange"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'gender'">
        <a-tag v-if="record.gender === 0" color="default">未知</a-tag>
        <a-tag v-else-if="record.gender === 1" color="blue">男</a-tag>
        <a-tag v-else color="pink">女</a-tag>
      </template>
      <template v-if="column.key === 'operation'">
        <a-popconfirm
            title='确定移除该学生？'
            ok-text="确定"
            cancel-text="取消"
            @confirm="handleRemoveCourseEnroll(record.userId)"
        >
          <a-tooltip title="移出课程">
            <a class="delBtn">
              <delete-outlined/>
            </a>
          </a-tooltip>
        </a-popconfirm>
      </template>
    </template>
  </a-table>
</template>

<script lang="ts" setup>
import { usePagination, useRequest } from 'vue-request'
import { apiImportStudent, apiListCourseEnroll, apiRemoveCourseEnroll } from '../../api/admin/course'
import { computed, ref, watch } from 'vue'
import { ColumnType, TablePaginationConfig, TableProps } from 'ant-design-vue/es/table'
import { FilterValue } from 'ant-design-vue/es/table/interface'
import { DeleteOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
// eslint-disable-next-line no-undef
const props = defineProps<{
  courseId: number
}>()

const columns = computed<ColumnType[]>(() => [
  {
    title: '姓名',
    dataIndex: 'username',
    width: '5%'
  },
  {
    title: '学号',
    dataIndex: 'userNum',
    width: '8%',
    sorter: true
  },
  {
    title: '班级',
    dataIndex: 'organization',
    width: '10%'
  },
  {
    title: '专业',
    dataIndex: 'major',
    width: '10%'
  },
  {
    title: '操作',
    key: 'operation',
    width: '5%'
  }
])

const {
  data: dataCourseEnroll,
  refresh: refreshCourseEnroll,
  run: runCourseEnroll,
  loading: loadingCourseEnroll,
  pageSize,
  current,
  total
} =
    usePagination(apiListCourseEnroll, {
      manual: false,
      formatResult: (res) => {
        return res.data.result
      },
      defaultParams: [
        {
          courseId: props.courseId
        }
      ]
    })

const pag = computed<TablePaginationConfig>(() => ({
  total: total.value,
  current: current.value,
  onChange: (page: number) => {
    current.value = page
  }
}))

const handleTableChange: TableProps['onChange'] = (
  pag: TablePaginationConfig,
  filters: Record<string, FilterValue | null>,
  sorter: any
) => {
  for (const key in filters) {
    if (filters[key] === null) {
      delete filters[key]
    }
  }
  runCourseEnroll({
    courseId: props.courseId,
    current: pag.current,
    sortField: sorter.field,
    sortOrder: sorter.order,
    filterFields: filters
  })
}

const {
  run: runRemoveCourseEnroll,
  error: errRemoveCourseEnroll
} = useRequest(apiRemoveCourseEnroll)

const handleRemoveCourseEnroll = async(userId: number) => {
  await runRemoveCourseEnroll({
    userId: userId,
    courseId: props.courseId
  })
  if (errRemoveCourseEnroll.value) {
    return
  }
  await runCourseEnroll({
    courseId: props.courseId
  })
}

const importStudentNum = ref<String>('')

const {
  run: runImportStudent,
  loading: loadingImportStudent,
  error: errorImportStudent
} = useRequest(apiImportStudent, {
  formatResult: res => {
    return res.data.result
  },
  onSuccess: res => {
    if (res !== '') {
      message.warning(res)
    }
  }
})

const handleImportStudent = async() => {
  await runImportStudent({
    courseId: props.courseId,
    studentNum: importStudentNum.value.split('\n')
  })
  if (errorImportStudent.value) {
    return
  }
  await refreshCourseEnroll()
}

</script>

<style lang="scss" scoped>
.btnSpace {
  margin-bottom: 16px;
  display: flex;
}

.delBtn {
  color: #ff7875
}
</style>
