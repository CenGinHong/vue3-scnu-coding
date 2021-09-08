<template>
  <a-table
      :columns="columns"
      :row-key="record => record.labSubmitId"
      :data-source="dataGetLabSubmit?.records"
      :pagination="pag"
      :loading="loadingGetLabSubmit"
      @change="handleTableChange">
    <template #updatedAt="{ text }">
      {{ moment(text).format('YYYY-MM-DD hh:mm') }}
    </template>
    <template #isFinish="{ record }">
      <a-switch v-model:checked="record.isFinish"/>
    </template>
    <template #score="{ record }">
      <a-tag :color="scoreTagColor(record.score)">{{ record.score }}</a-tag>
    </template>
    <template #operation="{ record }">
      <a @click="emitMark(record.userDetail.username,record.userDetail.userNum,record.labSubmitId)">批阅</a>
    </template>
  </a-table>
</template>

<script lang="ts" setup>
import moment from 'moment'
import { computed } from 'vue'
import { usePagination } from 'vue-request'
import { apiListLabSubmit } from '../../../api/web/labSubmit'
import { TableStateFilters } from 'ant-design-vue/es/table/interface'
import { scoreTagColor } from '../../../util/utils'
import { columnType, pagination } from '../../../api/common'

// eslint-disable-next-line no-undef
const props = defineProps<{
  labId: number
}>()

const columns: columnType[] = [
  {
    title: '姓名',
    width: '100px',
    dataIndex: 'userDetail.username'
  },
  {
    title: '学号',
    width: '180px',
    dataIndex: 'userDetail.userNum'
  },
  {
    title: '是否完成',
    dataIndex: 'isFinish',
    width: '120px',
    sorter: true,
    slots: { customRender: 'isFinish' }
  },
  {
    title: '评分',
    dataIndex: 'score',
    width: '100px',
    sorter: true,
    slots: { customRender: 'score' }
  },
  {
    title: '评语',
    dataIndex: 'labSubmitComment'
  },
  {
    title: '最后更新',
    width: '160px',
    dataIndex: 'updatedAt',
    slots: { customRender: 'updatedAt' }
  },
  {
    title: '操作',
    dataIndex: 'operation',
    slots: { customRender: 'operation' }
  }
]
const {
  run: runGetLabSubmit,
  data: dataGetLabSubmit,
  loading: loadingGetLabSubmit,
  pageSize,
  current,
  total
} = usePagination(apiListLabSubmit, {
  manual: false,
  formatResult: (res) => {
    return res.data.result
  },
  defaultParams: [{
    labId: props.labId
  }]
})
// 分页数据
const pag = computed<pagination>(() => ({
  onChange (page: number) {
    current.value = page
  },
  total: total.value,
  pageSize: pageSize.value
}))

// 表格重新加载函数
const handleTableChange = (pag: pagination, filters: TableStateFilters, sorter: any) => {
  runGetLabSubmit({
    labId: props.labId,
    current: pag?.current,
    sortField: sorter.field,
    sortOrder: sorter.order
  })
}

</script>

<style lang="scss" scoped>

</style>
