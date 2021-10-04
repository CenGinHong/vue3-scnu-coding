<template>
  <a-table
    :columns="columns"
    :data-source="dataCourseEnroll?.records"
    :loading="loadingCourseEnroll"
    :pagination="pag"
  >
  </a-table>
</template>

<script lang="ts" setup>
import { columnType } from '../../api/common'
import { usePagination } from 'vue-request'
import { apiListCourseEnroll } from '../../api/admin/course'
import { computed } from 'vue'

// eslint-disable-next-line no-undef
const props = defineProps<{
  courseId: number
}>()

const columns: columnType[] = [
  {
    title: '姓名',
    dataIndex: ['userDetail', 'username'],
    width: '10%'
  },
  {
    title: '学号',
    dataIndex: ['userDetail', 'userNum'],
    width: '10%'
  },
  {
    title: '年级',
    dataIndex: ['userDetail', 'grade'],
    width: '10%'
  },
  {
    title: '学院',
    dataIndex: ['userDetail', 'school'],
    width: '10%'
  },
  {
    title: '班级',
    dataIndex: ['userDetail', 'organization'],
    width: '10%'
  },
  {
    title: '专业',
    dataIndex: ['userDetail', 'major'],
    width: '10%'
  },
  {
    title: '性别',
    dataIndex: ['userDetail', 'gender'],
    width: '10%'
  }
]

const { data: dataCourseEnroll, loading: loadingCourseEnroll, pageSize, current, total } =
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

const pag = computed(() => ({
  total: total.value,
  current: current.value,
  onChange: (page:number) => {
    current.value = page
  }
}))
</script>

<style scoped></style>
