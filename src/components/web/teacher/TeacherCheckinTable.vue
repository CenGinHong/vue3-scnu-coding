<template>
  <div :class="style.btuDiv">
    <a-space class="btuSpace">
      <a-button type="primary" @click="visibleModal = true">
        <form-outlined/>
        添加签到
      </a-button>
      <a-button
          :disabled="selectedRowKeys.length === 0"
          :loading="loadingDeleteCheckinRecords"
          danger
          @click="handleDeleteCheckinRecords"
      >
        <delete-outlined/>
        删除记录
      </a-button>
      <a-button
          :disabled="loadingListCheckinRecord"
          @click="handleRefreshListCheckinRecord"
      >
        <reload-outlined/>
        刷新
      </a-button>
      <a-button :loading="loadingExportCsv" @click="handleExportCheckinCsv">
        <export-outlined/>
        导出CSV
      </a-button>
    </a-space>
  </div>
  <a-table
      :columns="columnCheckinRecord"
      :data-source="dataListCheckinRecord?.records"
      :expanded-row-keys="expendedRowKeys"
      :loading="loadingListCheckinRecord"
      :pag="pagListCheckinRecord"
      :pagination="pagListCheckinRecord"
      :row-key="(record) => record.checkinRecordId"
      :row-selection="{
      selectedRowKeys: selectedRowKeys,
      onChange: onSelectChange,
    }"
      @expand="handleExpand"
      @expandedRowsChange="expandedRowKeysChange"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'createdAt'">
        {{ dayjs(record.createdAt).format('YYYY-MM-DD hh:mm') }}
      </template>
      <template v-if="column.dataIndex === 'attendance'">
        {{ record.attendance.checkinCount }} / {{ record.attendance.takeCount }}
      </template>
    </template>
    <template #expandedRowRender>
      <a-table
          :columns="checkinDetailColumn"
          :data-source="dataListCheckinDetail?.records"
          :expanded-row-keys="expendedRowKeys"
          :loading="loadingListCheckinDetail"
          :pagination="pagListCheckinDetail"
          :row-key="(record) => record.checkinDetailId"
          size="small"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === ['userDetail', 'isCheckin']">
            <a-switch
                v-model:checked="record.checkinDetail.isCheckin"
                :loading="
                queriesUpdateCheckinDetail[record.checkinDetail.checkinDetailId]
                  ?.error
              "
                @click="
                handleUpdateCheckinDetail(
                  record.checkinDetail.checkinDetailId,
                  record.isCheckin
                )
              "
            />
          </template>
        </template>
      </a-table>
    </template>
  </a-table>
  <checkin-modal
      v-model:visible="visibleModal"
      :course-id="courseId"
      @refresh-list="refreshListCheckinRecord">
  </checkin-modal>
</template>

<script lang="ts" setup>
import { computed, createVNode, reactive, ref, useCssModule } from 'vue'
import { columnType } from '../../../api/common'
import { usePagination, useRequest } from 'vue-request'
import {
  apiDeleteCheckinRecords,
  apiListCheckinDetailByCheckinRecordId,
  apiListCheckinRecordByCourseId,
  apiUpdateCheckinDetailByCheckinDetailId,
  apiExportCsv
} from '../../../api/web/checkin'
import {
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
import { Modal } from 'ant-design-vue'
import CheckinModal from './CheckinModal.vue'

// eslint-disable-next-line no-undef
const props = defineProps<{
  courseId: number
}>()

// 表格列项
const columnCheckinRecord: columnType[] = [
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
const handleRefreshListCheckinRecord = () => {
  refreshListCheckinRecord()
}

// 签到详情
const checkinDetailColumn: columnType[] = [
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

const expandedRowKeysChange = (keys: number[]) => {
  if (keys.length > 1) {
    expendedRowKeys.value = [keys[keys.length - 1]]
  } else {
    expendedRowKeys.value = keys
  }
  runListCheckinDetail({ checkinRecordId: keys[keys.length - 1] })
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
  run: runExportCsv,
  data: dataExportCsv,
  loading: loadingExportCsv,
  error: errExportCsv
} = useRequest(apiExportCsv)

const handleExportCheckinCsv = async() => {
  await runExportCsv({ courseId: props.courseId })
  if (errExportCsv.value) {
    return
  }
  // 构建dom来下载
  const filename = '签到表.csv'
  const url = window.URL.createObjectURL(new Blob([dataExportCsv.value!.data]))
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const handleExpand = (expanded: boolean, record: listCheckinRecordResp) => {
  // 展开时开始加载
  if (expanded) {
    // 获取数据
    runListCheckinDetail({
      checkinRecordId: record.checkinRecordId
    })
  }
}

// 修改签到记录
const { run: runUpdateCheckinDetail, queries: queriesUpdateCheckinDetail } =
    useRequest(apiUpdateCheckinDetailByCheckinDetailId, {
      formatResult: (res) => {
        return res.data.result
      },
      queryKey: (updateCheckinDetailReq) =>
        String(updateCheckinDetailReq.checkinDetailId)
    })

const handleUpdateCheckinDetail = async(
  checkinDetailId: number,
  isCheckin: boolean
) => {
  await runUpdateCheckinDetail({
    checkinDetailId,
    isCheckin
  })
  if (queriesUpdateCheckinDetail[checkinDetailId]?.error) {
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
  loading: loadingDeleteCheckinRecords,
  error: errDeleteCheckinRecords
} = useRequest(apiDeleteCheckinRecords)

const selectedRowKeys = ref<number[]>([])

const onSelectChange = (keys: number[]) => {
  selectedRowKeys.value = keys
}

const handleDeleteCheckinRecords = async() => {
  Modal.confirm({
    title: '确认删除签到记录？',
    icon: createVNode(ExclamationCircleOutlined),
    content: '删除签到记录将会删除在该签到下的详情，请谨慎操作！',
    okText: '确认',
    okButtonProps: { loading: loadingDeleteCheckinRecords.value, danger: true },
    onOk: async() => {
      await runDeleteCheckinRecords({
        checkinRecordIds: selectedRowKeys.value
      })
      if (errDeleteCheckinRecords.value) {
        return
      }
      await refreshListCheckinRecord()
    },
    cancelText: '取消'
  })
}

const style = useCssModule()
</script>

<style lang="scss" module>
.btuDiv {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-bottom: 20px;
}
</style>
