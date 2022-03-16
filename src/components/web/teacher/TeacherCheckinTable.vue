<template>
    <a-space class="btuDiv">
      <a-button type="primary" @click="visibleModal = true">
        <form-outlined/>
        添加签到
      </a-button>
      <a-button
          :disabled="loadingListCheckinRecord"
          @click="handleRefreshListCheckinRecord"
      >
        <reload-outlined/>
        刷新
      </a-button>
      <a-button :loading="loadingExportToExcel" @click="handleExportCheckinToExcel">
        导出签到表
      </a-button>
    </a-space>
  <a-table
      :columns="columnCheckinRecord"
      :data-source="dataListCheckinRecord?.records"
      :expanded-row-keys="expendedRowKeys"
      :loading="loadingListCheckinRecord"
      :pag="pagListCheckinRecord"
      :pagination="pagListCheckinRecord"
      :row-key="TableRowKey"
      @expandedRowsChange="expandedRowKeysChange"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'createdAt'">
        {{ dayjs(record.createdAt).format('YYYY-MM-DD hh:mm') }}
      </template>
      <template v-if="column.dataIndex === 'attendance'">
        {{ record.attendance.checkinCount }} / {{ record.attendance.takeCount }}
      </template>
      <template v-if="column.key==='operation'">
        <a-popconfirm
            title="确认删除?"
            ok-text="确认"
            cancel-text="取消"
            @confirm="handleDeleteCheckinRecords(record.checkinRecordId)"
        >
        <a-button type="link" class="delBtn"
                  :loading="queriesDeleteCheckinRecords[record.checkinRecordId]?.loading">
          <delete-outlined/>
        </a-button>
        </a-popconfirm>
      </template>
    </template>
    <template #expandedRowRender>
      <a-table
          :columns="checkinDetailColumn"
          :data-source="dataListCheckinDetail?.records"
          :expanded-row-keys="expendedRowKeys"
          :loading="loadingListCheckinDetail"
          :pagination="pagListCheckinDetail"
          :row-key="subTableRowKey"
          size="small"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'isCheckin'">
            <a-switch
                v-model:checked="record.checkinDetail.isCheckin"
                :loading="
                queriesUpdateCheckinDetail[record.checkinDetail.checkinDetailId]
                  ?.error
              "
                @click="
                handleUpdateCheckinDetail(
                  record.userId,
                  record.checkinDetail.isCheckin
                )
              "/>
          </template>
        </template>
      </a-table>
    </template>
  </a-table>
  <a-modal
      v-model:visible="visibleModal"
      title="创建签到"
      :footer="null"
  >
    <insert-checkin-form
        :course-id="courseId"
        @finish="handleFinishInsert">
    </insert-checkin-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { usePagination, useRequest } from 'vue-request'
import {
  apiDeleteCheckinRecords,
  apiListCheckinDetailByCheckinRecordId,
  apiListCheckinRecordByCourseId,
  apiUpdateCheckinDetailByCheckinDetailId,
  apiExportCsv
} from '../../../api/web/checkin'
import {
  listCheckinDetailResp,
  listCheckinRecordResp
} from '../../../api/web/model/checkinModel'
import dayjs from 'dayjs'
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  FormOutlined,
  ReloadOutlined,
  ExportOutlined
} from '@ant-design/icons-vue'
import InsertCheckinForm from './InsertCheckinForm.vue'
import { ColumnType } from 'ant-design-vue/es/table'
import { dataToFile } from '../../../util/utils'
import { message } from 'ant-design-vue'

// eslint-disable-next-line no-undef
const props = defineProps<{
  courseId: number
}>()

// 表格列项
const columnCheckinRecord: ColumnType[] = [
  {
    title: '名称',
    dataIndex: 'checkinName',
    width: '30%'
  },
  {
    title: '密钥',
    dataIndex: 'checkinKey',
    width: '10%'
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    width: '30%%'
  },
  {
    title: '出勤比例',
    dataIndex: 'attendance',
    width: '30%'
  },
  {
    title: '操作',
    key: 'operation',
    width: '10%'
  }
]

// 获取签到数据数据
const {
  data: dataListCheckinRecord,
  loading: loadingListCheckinRecord,
  pageSize: pageSizeListCheckinRecord,
  current: currentListCheckinRecord,
  total: totalListCheckinRecord,
  refresh: refreshListCheckinRecord
} = usePagination(apiListCheckinRecordByCourseId, {
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

// 分页数据
const pagListCheckinRecord = computed(() => ({
  onChange(page: number) {
    currentListCheckinRecord.value = page
  },
  total: totalListCheckinRecord.value,
  pageSize: pageSizeListCheckinRecord.value
}))

// 刷新签到记录
const handleRefreshListCheckinRecord = async() => {
  await refreshListCheckinRecord()
  if (errDeleteCheckinRecords.value) {
    return
  }
  message.success('刷新成功')
}

// 签到详情
const checkinDetailColumn: ColumnType[] = [
  {
    title: '姓名',
    dataIndex: ['userDetail', 'username'],
    width: '40%'
  },
  {
    title: '学号',
    dataIndex: ['userDetail', 'userNum'],
    width: '40%'
  },
  {
    title: '是否签到',
    dataIndex: ['userDetail', 'isCheckin'],
    key: 'isCheckin',
    width: '20%'
  }
]

// 获取签到详情
// TODO usePagination 不能用queryKey，暂时不知道怎么维护多状态列表，暂时只能展开一个
const {
  run: runListCheckinDetail,
  data: dataListCheckinDetail,
  loading: loadingListCheckinDetail,
  pageSize: pageSizeListCheckinDetail,
  current: currentListCheckinDetail,
  total: totalListCheckinDetail
} = usePagination(apiListCheckinDetailByCheckinRecordId, {
  formatResult: (res) => {
    return res.data.result
  }
})

const expendedRowKeys = ref<number[]>([])

const selectedCheckinRecordId = ref<number>(0)

const expandedRowKeysChange = (keys: number[]) => {
  if (keys.length > 0) {
    expendedRowKeys.value = [keys[keys.length - 1]]
    selectedCheckinRecordId.value = keys[keys.length - 1]
    runListCheckinDetail({ checkinRecordId: keys[keys.length - 1] })
  } else {
    expendedRowKeys.value = keys
  }
}

// 分页数据
const pagListCheckinDetail = computed(() => ({
  size: 'small',
  onChange(page: number) {
    currentListCheckinDetail.value = page
  },
  total: totalListCheckinDetail.value,
  pageSize: pageSizeListCheckinDetail.value
}))

const {
  run: runExportToExcel,
  loading: loadingExportToExcel
} = useRequest(apiExportCsv, {
  onSuccess: res => {
    dataToFile(res)
  }
})

const handleExportCheckinToExcel = () => {
  runExportToExcel({ courseId: props.courseId })
}

// 修改签到记录
const { run: runUpdateCheckinDetail, queries: queriesUpdateCheckinDetail } =
    useRequest(apiUpdateCheckinDetailByCheckinDetailId, {
      queryKey: (updateCheckinDetailReq) =>
        String(updateCheckinDetailReq.userId)
    })

const handleUpdateCheckinDetail = async(
  userId :number,
  isCheckin: boolean
) => {
  await runUpdateCheckinDetail({
    userId,
    checkinRecordId: selectedCheckinRecordId.value,
    isCheckin
  })
  if (queriesUpdateCheckinDetail[userId]?.error) {
    return
  }
  // 原地修改
  if (dataListCheckinRecord.value) {
    const checkinRecordId = expendedRowKeys.value[0]
    for (const item of dataListCheckinRecord.value.records) {
      if (item.checkinRecordId === checkinRecordId) {
        if (isCheckin) {
          item.attendance.checkinCount++
        } else {
          item.attendance.checkinCount--
        }
        break
      }
    }
  }
}

// 插入框可见
const visibleModal = ref<boolean>(false)

const {
  run: runDeleteCheckinRecords,
  queries: queriesDeleteCheckinRecords,
  error: errDeleteCheckinRecords
} = useRequest(apiDeleteCheckinRecords, {
  queryKey: (id) => String(id)
})

const handleDeleteCheckinRecords = async(id: number) => {
  await runDeleteCheckinRecords(
    id
  )
  if (errDeleteCheckinRecords.value) {
    return
  }
  await refreshListCheckinRecord()
}

const handleFinishInsert = () => {
  visibleModal.value = false
  refreshListCheckinRecord()
}

const TableRowKey = (record :listCheckinRecordResp) => {
  return record.checkinRecordId
}
const subTableRowKey = (record :listCheckinDetailResp) => {
  return record.checkinDetail?.checkinDetailId
}

</script>

<style lang="scss" scoped>
.btuDiv {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-bottom: 20px;
}

.delBtn {
  color: #ff4d4f;
}
</style>
