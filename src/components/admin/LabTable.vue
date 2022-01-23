<template>
  <a-table
      :columns="columns"
      :data-source="dataAllLab?.records"
      :loading="loadingAllLab"
      :pagination="pag"
      :row-key="record => record.labId"
      @change="handleTableChange"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'gender'">
        <a-tag v-if="record.gender === 0" color="default">未知</a-tag>
        <a-tag v-else-if="record.gender === 1" color="blue">男</a-tag>
        <a-tag v-else-if="record.gender === 2" color="pink">女</a-tag>
      </template>
      <template
          v-if="column.dataIndex === 'deadline'"
      >{{ dayjs(record.createdAt).format('YYYY-MM-DD hh:mm') }}
      </template>
      <template
          v-if="column.dataIndex === 'attachmentSrc'"
      >
        <a v-if="record.attachmentSrc!==''">
          <file-outlined/>
        </a>
        <template v-else>
          无
        </template>
      </template>
      <template
          v-if="column.key === 'operation'"
      >
        <a-tooltip title="编辑">
          <a-button type="link" @click="showDrawerUpdateLab(record.labId)">
            <edit-outlined/>
          </a-button>
        </a-tooltip>
        <a-tooltip title="提交详情">
          <a-button type="link" @click="showDrawerSubmitTable(record.labId)">
            <bars-outlined/>
          </a-button>
        </a-tooltip>
        <a-tooltip title="讨论">
          <a-button type="link" @click="showDrawerSubmitTable(record.labId)">
            <comment-outlined/>
          </a-button>
        </a-tooltip>
      </template>
    </template>
  </a-table>
  <a-drawer
      title="修改实验"
      :width="1020"
      v-model:visible="visibleDrawerUpdateLab"
      :body-style="{ paddingBottom: '80px' }"
      :footer-style="{ textAlign: 'right' }"
  >
    <update-lab-form :labId="selectedLabId"/>
  </a-drawer>
  <a-drawer
      title="实验提交"
      :width="1380"
      v-model:visible="visibleDrawerSubmitTable"
      :body-style="{ paddingBottom: '80px' }"
      :footer-style="{ textAlign: 'right' }"
  >
    <lab-submit-table :lab-id="selectedLabId"/>
  </a-drawer>
</template>

<script lang="ts" setup>

import { ColumnType, TablePaginationConfig, TableProps } from 'ant-design-vue/es/table'
import { computed, ref } from 'vue'
import { usePagination } from 'vue-request'
import { apiListAllLab } from '../../api/admin/lab'
import dayjs from 'dayjs'
import { FileOutlined, EditOutlined, BarsOutlined, CommentOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { ROUTER_NAME } from '../../router'
import { useRouter } from 'vue-router'
import UpdateLabForm from '../web/teacher/UpdateLabForm.vue'
import LabSubmitTable from './LabSubmitTable.vue'

const columns = computed<ColumnType[]>(() => [
  {
    title: '实验名称',
    dataIndex: 'title',
    width: '8%'
  },
  {
    title: '所属课程',
    dataIndex: ['courseDetail', 'courseName'],
    key: 'courseId',
    width: '5%',
    filters: dataAllLab.value?.filter.courseName
  },
  {
    title: '实验内容',
    dataIndex: 'content',
    width: '20%',
    ellipsis: true
  },
  {
    title: '附件',
    dataIndex: 'attachmentSrc',
    width: '3%'
  },
  {
    title: '类型',
    dataIndex: 'type',
    width: '3%'
  },
  {
    title: '截止日期',
    dataIndex: 'deadline',
    width: '5%'
  }, {
    title: '操作',
    key: 'operation',
    width: '6%'
  }
])

const {
  run: runAllLab,
  data: dataAllLab,
  loading: loadingAllLab,
  pageSize,
  current,
  total
} = usePagination(apiListAllLab, {
  manual: false,
  formatResult: (res) => {
    return res.data.result
  }
})

const pag = computed<TablePaginationConfig>(() => ({
  onChange: (page: number) => {
    current.value = page
  },
  total: total.value,
  pageSize: pageSize.value
}))

const handleTableChange: TableProps['onChange'] = (
  pag: TablePaginationConfig,
  filters: any,
  sorter: any
) => {
  console.log(filters)
  for (const key in filters) {
    if (filters[key] === null) {
      delete filters[key]
    }
  }
  runAllLab({
    current: pag.current,
    sortField: sorter.field,
    sortOrder: sorter.order,
    filterFields: {
      ...filters
    }
  })
}

const selectedLabId = ref<number>(0)

const visibleDrawerUpdateLab = ref<boolean>(false)

const showDrawerUpdateLab = (labId: number) => {
  selectedLabId.value = labId
  visibleDrawerUpdateLab.value = true
}

const visibleDrawerSubmitTable = ref<boolean>(false)

const showDrawerSubmitTable = (labId: number) => {
  console.log(labId)
  selectedLabId.value = labId
  visibleDrawerSubmitTable.value = true
}

const router = useRouter()

const handleRouteToSubmitDetail = (labId: number) => {
  router.push({
    name: ROUTER_NAME.LAB_MANAGEMENT_SUBMIT,
    query: {
      labId: labId
    }
  })
}

</script>

<style scoped>

</style>
