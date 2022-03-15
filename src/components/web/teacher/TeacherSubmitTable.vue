<template>
  <a-space class="btuSpace">
    <a-button @click="handleRefreshListLabSubmit">
      <reload-outlined/>
      刷新
    </a-button>
  </a-space>
  <a-table
      :columns="columns"
      :data-source="dataListLabSubmit?.records"
      :loading="loadingListLabSubmit"
      :pagination="pag"
      @change="handleTableChange"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'score'">
        <a-tag
            v-if="record.labSubmitDetail"
            :color="scoreTagColor(record.labSubmitDetail.score)"
        >
          {{ record.labSubmitDetail.score }}
        </a-tag>
        <a-tag v-else color="gray">未评分</a-tag>
      </template>
      <template v-if="column.dataIndex === 'isIDERunning'">
        <a-tag
            v-if="record.isIDERunning"
            color="success"
        >
          运行中
        </a-tag>
        <a-tag v-else color="default">
          未运行
        </a-tag>
      </template>
      <!--      <template v-if="column.dataIndex === 'updatedAt'">-->
      <!--        {{-->
      <!--          record.labSubmitDetail.updatedAt === undefined-->
      <!--              ? '无'-->
      <!--              : dayjs(record.labSubmitDetail.updatedAt).format('YYYY-MM-DD hh:mm')-->
      <!--        }}-->
      <!--      </template>-->
      <template v-if="column.dataIndex === 'isFinish'">
        <a-tag v-if="record.labSubmitDetail?.isFinish" color="success"
        >已完成
        </a-tag
        >
        <a-tag v-else color="error">未完成</a-tag>
      </template>
    </template>
  </a-table>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { usePagination } from 'vue-request'
import dayjs from 'dayjs'
import { apiListLabSubmit } from '../../../api/web/labSubmit'
import { scoreTagColor } from '../../../util/utils'
import { ColumnType } from 'ant-design-vue/es/table'
import {message, TablePaginationConfig} from 'ant-design-vue'
import { ReloadOutlined } from '@ant-design/icons-vue'

// eslint-disable-next-line no-undef
const props = defineProps<{
  labId: number
}>()

const columns: ColumnType[] = [
  {
    title: '姓名',
    width: '100px',
    dataIndex: ['userDetail', 'username']
  },
  {
    title: '学号',
    width: '180px',
    dataIndex: ['userDetail', 'userNum']
  },
  {
    title: 'IDE状态',
    dataIndex: 'isIDERunning'
  },
  {
    title: '是否完成',
    dataIndex: 'isFinish',
    width: '120px'
  },
  {
    title: '评分',
    dataIndex: 'score',
    width: '100px'
  },
  {
    title: '评语',
    dataIndex: ['labSubmitDetail', 'labSubmitComment']
  }
]
const {
  run: runListLabSubmit,
  data: dataListLabSubmit,
  loading: loadingListLabSubmit,
  refresh: refreshListLabSubmit,
    error: errListLabSubmit,
  pageSize,
  current,
  total
} = usePagination(apiListLabSubmit, {
  manual: false,
  formatResult: (res) => {
    return res.data.result
  },
  defaultParams: [
    {
      labId: props.labId
    }
  ]
})

const handleRefreshListLabSubmit = async() => {
  await refreshListLabSubmit()
  if (errListLabSubmit.value) {
    return
  }
  message.success('刷新成功')
}

// 分页数据
const pag = computed<TablePaginationConfig>(() => ({
  onChange(page: number) {
    current.value = page
  },
  total: total.value,
  pageSize: pageSize.value
}))

// 表格重新加载函数
const handleTableChange = (pag: TablePaginationConfig, filters: any, sorter: any) => {
  runListLabSubmit({
    labId: props.labId,
    current: pag?.current,
    sortField: sorter.field,
    sortOrder: sorter.order
  })
}
</script>

<style lang="scss" scoped>
.btuSpace {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-bottom: 20px;
}
</style>
