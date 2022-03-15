<template>
  <a-table
      :columns="columns"
      :data-source="dataListLabSubmitByLabId?.records"
      :loading="loadingLabSubmitByLabId"
      :pagination="pag"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'gender'">
        <a-tag v-if="record.gender === 0" color="default">未知</a-tag>
        <a-tag v-else-if="record.gender === 1" color="blue">男</a-tag>
        <a-tag v-else-if="record.gender === 2" color="pink">女</a-tag>
      </template>
      <template v-if="column.key === 'isFinish'">
        <a-tag v-if="record.labSubmitDetail.isFinish" color="success">已完成</a-tag>
        <a-tag v-else color="error">未完成</a-tag>
      </template>
      <template
          v-if="column.dataIndex === 'updatedAt'"
      >{{ dayjs(record.createdAt).format('YYYY-MM-DD hh:mm') }}
      </template>
      <template
          v-if="column.dataIndex === 'attachmentSrc'"
      >
        <a-button size="small" v-if="record.attachmentSrc!==''">
          <file-outlined/>
        </a-button>
        <template v-else>
          无
        </template>
      </template>
      <template
          v-if="column.key === 'operation'"
      >
        <a-space>
          <a-tooltip title="编辑">
            <a>
              <edit-outlined/>
            </a>
          </a-tooltip>
          <a-tooltip title="查看代码">
            <a>
              <code-sandbox-outlined/>
            </a>
          </a-tooltip>
          <a-tooltip title="查看报告" @click="handleShowReport(record.labId)">
            <a>
              <read-outlined/>
            </a>
          </a-tooltip>
        </a-space>
      </template>
    </template>
  </a-table>
  <a-modal
      title="实验报告"
      :width="920"
      :footer="null"
      v-model:visible="visibleReport">
<!--    <report-read-board />-->
  </a-modal>
</template>

<script lang="ts" setup>
import { ColumnType, TablePaginationConfig } from 'ant-design-vue/es/table'
import { computed, ref, watch } from 'vue'
import { usePagination } from 'vue-request'
import { apiListLabSubmitByLabId } from '../../api/admin/labSubmit'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'
import {
  FileOutlined,
  EditOutlined,
  BarsOutlined,
  CommentOutlined,
  ReadOutlined,
  CodeSandboxOutlined
} from '@ant-design/icons-vue'
import ReportReadBoard from '../web/ReportReadBoard.vue'

// eslint-disable-next-line no-undef
const props = defineProps<{
  labId: number
}>()

const columns = computed<ColumnType[]>(() => [
  {
    title: '姓名',
    width: '8%',
    dataIndex: ['userDetail', 'username']
  },
  {
    title: '学号',
    width: '10%',
    dataIndex: ['userDetail', 'userNum']
  },
  {
    title: '是否完成',
    dataIndex: ['labSubmitDetail', 'isFinish'],
    key: 'isFinish',
    width: '10%'
  },
  {
    title: '评分',
    dataIndex: ['labSubmitDetail', 'score'],
    width: '10%'
  },
  {
    title: '评语',
    dataIndex: ['labSubmitDetail', 'labSubmitComment'],
    ellipsis: true,
    width: '20%'
  },
  {
    title: '最后更新',
    dataIndex: 'updatedAt',
    width: '15%'
  },
  {
    title: '操作',
    width: '10%',
    key: 'operation'
  }
])

const {
  run: runListLabSubmitByLabId,
  data: dataListLabSubmitByLabId,
  loading: loadingLabSubmitByLabId,
  current,
  total,
  pageSize
} = usePagination(apiListLabSubmitByLabId, {
  manual: false,
  formatResult: res => {
    console.log(res)
    return res.data.result
  },
  defaultParams: [
    {
      labId: props.labId
    }
  ]
})

const pag = computed<TablePaginationConfig>(() => ({
  onChange: (page: number) => {
    current.value = page
  },
  total: total.value,
  pageSize: pageSize.value
}))

const router = useRouter()

watch(props, () => {
  runListLabSubmitByLabId({
    labId: props.labId
  })
})

const visibleReport = ref<Boolean>(false)
const selectedLabId = ref<number>()
const handleShowReport = (labId: number) => {
  selectedLabId.value = labId
  visibleReport.value = true
}
</script>

<style scoped>

</style>
