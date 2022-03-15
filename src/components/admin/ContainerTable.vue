<template>
  <a-table
      :columns="columns"
      :data-source="dataIDE?.records"
      :loading="loadingIDE"
      :pagination="pag"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'state'">
        <a-tag v-if="record.state === 'running'" color="green">运行中</a-tag>
        <a-tag v-else-if="record.state === 'exited'" color="red">退出</a-tag>
        <a-tag v-else-if="record.state === 'created'" color="default">创建态</a-tag>
      </template>
      <template v-if="column.dataIndex === 'memory'">
        {{ numFilter(record.memory)}} MiB / {{ numFilter(record.memoryLimit) }}Mib
      </template>

      <template v-if="column.key === 'operation'">
          <a-popconfirm
              title="确定重启该容器?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleRestartContainer(record.containerId)"
          >
            <a-tooltip title="重启">
              <a-button type="link" :loading="loadingRestartIDE">
                <redo-outlined/>
              </a-button>
            </a-tooltip>
          </a-popconfirm>
          <a-popconfirm
              title="确定移除该容器?"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleRemoveContainer(record.containerId)"
          >
            <template #icon>
              <question-circle-outlined style="color: red"/>
            </template>
            <a-tooltip title="移除">
              <a-button type="link" style="color: red" :loading="loadingRemoveIDE">
                <delete-outlined/>
              </a-button>
            </a-tooltip>
          </a-popconfirm>
      </template>
    </template>
  </a-table>
</template>

<script lang="ts" setup>

import { computed } from 'vue'
import { ColumnType, TablePaginationConfig } from 'ant-design-vue/es/table'
import { usePagination, useRequest } from 'vue-request'
import { apiListAllIDE, apiRemoveIDE, apiRestartIDE } from '../../api/admin/ide'
import { DeleteOutlined, RedoOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue'

const columns = computed<ColumnType[]>(() => [
  {
    title: '容器ID',
    dataIndex: 'containerId',
    width: '5%',
    ellipsis: true
  },
  {
    title: '用者姓名',
    dataIndex: ['userDetail', 'username'],
    width: '5%'
  },
  {
    title: '实验标题',
    dataIndex: ['labDetail', 'title'],
    width: '10%'
  },
  {
    title: '课程',
    dataIndex: ['labDetail', 'courseId'],
    width: '10%'
  },
  {
    title: '运行状态',
    dataIndex: 'state',
    width: '5%'
  },
  {
    title: '状态信息',
    dataIndex: 'status',
    width: '10%'
  },
  {
    title: '使用内存',
    dataIndex: 'memory',
    width: '10%'
  },
  {
    title: '操作',
    key: 'operation',
    width: '12%'
  }
])

const numFilter = (value: number) => {
  // 截取当前数据到小数点后两位
  const realVal = value / 1024 / 1024
  return realVal.toFixed(2)
}

const { data: dataIDE, refresh: refreshListIDE, loading: loadingIDE, pageSize, current, total } =
    usePagination(apiListAllIDE, {
      manual: false,
      formatResult: (res) => {
        console.log(res)
        return res.data.result
      }
    })

const pag = computed<TablePaginationConfig>(() => ({
  total: total.value,
  current: current.value,
  onChange: (page: number) => {
    current.value = page
  }
}))

const { run: runRestartIDE, error: errRestartIDE, loading: loadingRestartIDE } = useRequest(apiRestartIDE)

const handleRestartContainer = async(containerId: string) => {
  await runRestartIDE({
    containerId: containerId
  })
  if (errRestartIDE.value) {
    return
  }
  await refreshListIDE()
}

const { run: runRemoveIDE, error: errRemoveIDE, loading: loadingRemoveIDE } = useRequest(apiRemoveIDE)

const handleRemoveContainer = async(containerId: string) => {
  await runRemoveIDE({
    containerId: containerId
  })
  if (errRemoveIDE.value) {
    return
  }
  await refreshListIDE()
}

</script>

<style scoped>

</style>
