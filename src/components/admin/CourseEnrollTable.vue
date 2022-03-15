<template>
  <!--  <a-popover title="Title" trigger="click" placement="left">-->

  <!--    <template #content>-->
  <!--      <a-space direction="vertical">-->
  <!--        <a-textarea-->
  <!--            v-model:value="importStudentNum"-->
  <!--            placeholder="添加学生：请输入学号，一行一个"-->
  <!--            :auto-size="{ minRows: 3, maxRows: 5 }"-->
  <!--        />-->
  <!--        <a-button type="primary" @click="handleImportStudent" :loading="loadingImportStudent">-->
  <!--          确定-->
  <!--        </a-button>-->
  <!--      </a-space>-->
  <!--    </template>-->
  <!--  </a-popover>-->
  <a-space class="btnSpace">
    <a-button type="primary" @click="handleShowVisibleModalAddStudent">
      导入
    </a-button>
    <a-popconfirm
        title="确定移除出课程?"
        ok-text="确定"
        cancel-text="取消"
        @confirm="handleRemoveCourseEnroll"
    >
      <a-button danger :disabled="selectedRowKeys.length === 0">
        移除
      </a-button>
    </a-popconfirm>
  </a-space>

  <a-modal
      v-model:visible="visibleModalAddStudent"
      :ok-button-props="{ loading: loadingImportStudent }"
      cancel-text="取消"
      ok-text="导入"
      title="导入学生"
      @ok="handleImportStudent"
  >
    <a-textarea
        v-model:value="importStudentNum"
        placeholder="请输入学生学号，每一行为一位学生"
        rows="4"
    />
  </a-modal>
  <a-table
      :columns="columns"
      :data-source="dataCourseEnroll?.records"
      :loading="loadingCourseEnroll"
      :pagination="pag"
      @change="handleTableChange"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'gender'">
        <a-tag v-if="record.gender === 0" color="default">未知</a-tag>
        <a-tag v-else-if="record.gender === 1" color="blue">男</a-tag>
        <a-tag v-else color="pink">女</a-tag>
      </template>
    </template>
  </a-table>
</template>

<script lang="ts" setup>
import { usePagination, useRequest } from 'vue-request'
import { apiImportStudent, apiListCourseEnroll, apiRemoveCourseEnroll } from '../../api/admin/course'
import { computed, ref } from 'vue'
import { ColumnType, TablePaginationConfig, TableProps } from 'ant-design-vue/es/table'
import { FilterValue, Key } from 'ant-design-vue/es/table/interface'
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
    width: '200px'
  },
  {
    title: '学号',
    dataIndex: 'userNum',
    width: '200px',
    sorter: true
  },
  {
    title: '班级',
    dataIndex: 'organization',
    width: '200px'
  },
  {
    title: '专业',
    dataIndex: 'major',
    width: '200px'
  }
])

const selectedRowKeys = ref<Key[]>([])

const hasSelected = computed(() => selectedRowKeys.value.length > 0)

const onSelectChange = (Keys: Key[]) => {
  selectedRowKeys.value = Keys
}

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

const handleRemoveCourseEnroll = async() => {
  await runRemoveCourseEnroll({
    userIds: selectedRowKeys.value,
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

const visibleModalAddStudent = ref<boolean>(false)

const handleShowVisibleModalAddStudent = () => {
  visibleModalAddStudent.value = true
}

const handleImportStudent = async() => {
  if (importStudentNum.value === '') {
    message.error('不能为空')
  }
  const studentNums = importStudentNum.value.split('\n')
  // 必须要每个都满足是数字
  if (!studentNums.every(e => {
    return /^\d+$/.test(e)
  })) {
    message.error('学号需为数字')
    return
  }
  await runImportStudent({
    courseId: props.courseId,
    studentNums
  })
  if (errorImportStudent.value) {
    return
  }
  visibleModalAddStudent.value = false
  await refreshCourseEnroll()
}

</script>

<style lang="scss" scoped>
.btnSpace {
  margin-bottom: 16px;
  display: flex;
}

</style>
