<template>
  <a-table
      :columns="columns"
      :data-source="dataListLabSubmitByLabId?.records"
      :loading="loadingLabSubmitByLabId"
      :pagination="pag"
      :row-key="record => record.labId"
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
        <a-button type="text">
          <edit-outlined/>
        </a-button>
        <a-dropdown>
          <a-button type="text">
            <bars-outlined/>
          </a-button>
          <template #overlay>
            <a-menu>
              <a-menu-item >
                <read-outlined/>
                查看代码
              </a-menu-item>
              <a-menu-item>
                <comment-outlined/>
                查看实验报告
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </template>
  </a-table>
</template>

<script lang="ts" setup>
import { ColumnType, TablePaginationConfig } from 'ant-design-vue/es/table'
import { computed } from 'vue'
import { usePagination } from 'vue-request'
import { apiListLabSubmitByLabId } from '../../api/admin/labSubmit'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'
import { FileOutlined, EditOutlined, BarsOutlined, CommentOutlined, ReadOutlined } from '@ant-design/icons-vue'

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
    width: '30%'
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

</script>

<style scoped>

</style>
