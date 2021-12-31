<template>
  <base-course-list
    :dataSource="dataSource?.records"
    :loading="loading"
    :pag="pag"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { usePagination } from 'vue-request'
import { IPagination } from '../../../api/common'
import { apiListCourseByStuId } from '../../../api/web/course'
import BaseCourseList from '../BaseCourseList.vue'
import { useRouter } from 'vue-router'
import {TablePaginationConfig} from "ant-design-vue/es/table/Table";

const router = useRouter()
const {
  data: dataSource,
  loading,
  total,
  current,
  pageSize
} = usePagination(apiListCourseByStuId, {
  manual: false,
  formatResult: (res) => {
    return res.data.result
  }
})

// 分页数据
const pag = computed<TablePaginationConfig>(() => ({
  onChange(page: number) {
    current.value = page
  },
  total: total.value,
  pageSize: pageSize.value
}))
</script>

<style lang="scss" scoped></style>
