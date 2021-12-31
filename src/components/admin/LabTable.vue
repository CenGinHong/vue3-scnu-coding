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
          v-if="column.dataIndex === 'createdAt'"
      >{{ dayjs(record.createdAt).format('YYYY-MM-DD hh:mm') }}
      </template>
      <template
          v-if="column.dataIndex === 'updatedAt'"
      >{{ dayjs(record.createdAt).format('YYYY-MM-DD hh:mm') }}
      </template>
      <template
          v-if="column.dataIndex === 'deadline'"
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
        <a-dropdown-button @click="handleButtonClick">
          <edit-outlined />
          <template #overlay>
            <a-menu>
              <a-menu-item @click="handleRouteToSubmitDetail(record.labId)">
                <appstore-outlined/>
                查看提交情况
              </a-menu-item>
              <a-menu-item>
                <comment-outlined />
                查看讨论
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown-button>
      </template>
    </template>
  </a-table>
</template>

<script lang="ts" setup>

import { ColumnType, TablePaginationConfig, TableProps } from 'ant-design-vue/es/table'
import { computed } from 'vue'
import { usePagination } from 'vue-request'
import { apiListAllLab } from '../../api/admin/lab'
import dayjs from 'dayjs'
import { FileOutlined, EditOutlined, BarsOutlined, CommentOutlined, AppstoreOutlined } from '@ant-design/icons-vue'
import { ROUTER_NAME } from '../../router'
import { useRouter } from 'vue-router'

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
    width: '30%',
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
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    width: '5%'
  },
  {
    title: '修改时间',
    dataIndex: 'updatedAt',
    width: '5%'
  }, {
    title: '操作',
    key: 'operation',
    width: '8%'
  }
])

const { run: runAllLab, data: dataAllLab, loading: loadingAllLab, pageSize, current, total } = usePagination(apiListAllLab, {
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
