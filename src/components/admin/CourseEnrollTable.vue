<template>
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
    </template>
  </a-table>
</template>

<script lang="ts" setup>
import { usePagination } from 'vue-request'
import { apiListCourseEnroll } from '../../api/admin/course'
import { computed, ref } from 'vue'
import { ColumnType, TablePaginationConfig, TableProps } from 'ant-design-vue/es/table'

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
    title: '性别',
    dataIndex: 'gender',
    key: 'gender',
    filters: dataCourseEnroll.value?.filter.gender.map(e => {
      if (e.text === '1') {
        e.text = '男'
      } else if (e.text === '2') {
        e.text = '女'
      } else {
        e.text = '未知'
      }
      return e
    }),
    width: '5%'
  },
  {
    title: '年级',
    dataIndex: 'grade',
    filters: dataCourseEnroll.value?.filter.grade,
    width: '10%'
  },
  {
    title: '学院',
    dataIndex: 'school',
    filters: dataCourseEnroll.value?.filter.school,
    width: '10%'
  },
  {
    title: '班级',
    dataIndex: 'organization',
    filters: dataCourseEnroll.value?.filter.organization,
    width: '10%'
  },
  {
    title: '专业',
    dataIndex: 'major',
    filters: dataCourseEnroll.value?.filter.major,
    width: '10%'
  }
])

const { data: dataCourseEnroll, run: runCourseEnroll, loading: loadingCourseEnroll, pageSize, current, total } =
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
  filters: Record<string, string[]>,
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

const selectedRowKeys = ref<number[]>([])

const onSelectChange = (keys: number[]) => {
  selectedRowKeys.value = keys
}

</script>

<style lang="scss" scoped>
.btnSpace {
  margin-bottom: 16px;
  display: flex;
}
</style>
