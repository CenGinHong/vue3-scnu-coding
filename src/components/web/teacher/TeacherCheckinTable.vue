<template>
  <div :class="style.btuDiv">
    <a-space class="btuSpace">
      <a-button type="primary" @click="visibleModal=true">
        <form-outlined/>
        添加签到
      </a-button>
      <a-button :disabled="selectedRowKeys.length===0"
                :loading="loadingDeleteCheckinRecords"
                danger
                @click="handleDeleteCheckinRecords">
        <delete-outlined/>
        删除记录
      </a-button>
      <a-button :disabled="loadingListCheckinRecord"
                @click="handleRefreshListCheckinRecord">
        <reload-outlined/>
        刷新
      </a-button>
    </a-space>
  </div>
  <a-table :columns="columnCheckinRecord"
           :data-source="dataListCheckinRecord?.records"
           :loading="loadingListCheckinRecord"
           :expanded-row-keys="expendedRowKeys"
           :pagination="pagListCheckinRecord"
           @expandedRowsChange="expandedRowKeysChange"
           :row-key="record => record.checkinRecordId"
           :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
           @expand="handleExpand">
    <template #createdAt="{ text }">
      {{ moment(text).format('YYYY-MM-DD hh:mm') }}
    </template>
    <template #attendance="{ record }">
      {{ record.attendance.checkinCount }} / {{ record.attendance.takeCount }}
    </template>
    <template #expandedRowRender="{ record }">
      <a-table :columns="checkinDetailColumn"
               :expanded-row-keys="expendedRowKeys"
               :data-source="dataListCheckinDetail?.records"
               :loading="loadingListCheckinDetail"
               :pagination="pag"
               :row-key="record => record.checkinDetailId"
               size="small">
        <template #isCheckin="{ record }">
          <a-switch v-model:checked="record.checkinDetail.isCheckin"
                    :loading="queriesUpdateCheckinDetail[record.checkinDetail.checkinDetailId]?.error"
                    @click="handleUpdateCheckinDetail(record.checkinDetail.checkinDetailId,record.isCheckin)"/>
        </template>
      </a-table>
    </template>
  </a-table>
  <a-modal
      v-model:visible="visibleModal"
      cancelText="关闭"
      ok-text="创建"
      title="创建签到"
      @ok="handleInsertCheckinRecord">
    <a-form
        :label-col="{ span: 4 }"
        :model="insertCheckinState"
        :ok-button-props="{ loading: loadingInsertCheckin }"
        :wrapper-col="{ span: 18 }" name="custom-validation">
      <a-form-item label="签到名称" name="checkinName">
        <a-input v-model:value="insertCheckinState.checkinName"/>
      </a-form-item>
      <a-form-item label="签到时长(秒)" name="duration">
        <a-slider v-model:value="insertCheckinState.duration"/>
      </a-form-item>
      <a-form-item label="签到密钥" name="checkinKey">
        <a-input v-model:value="insertCheckinState.checkinKey"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { computed, createVNode, reactive, ref, useCssModule } from 'vue'
import { columnType, pagination } from '../../../api/common'
import { usePagination, useRequest } from 'vue-request'
import {
  ApiDeleteCheckinRecords,
  apiListCheckinDetailByCheckinRecordId,
  apiListCheckinRecordByCourseId,
  ApiInsertCheckinRecord,
  apiUpdateCheckinDetailByCheckinDetailId
} from '../../../api/web/checkin'
import {
  ListCheckinRecordResp,
  InsertCheckinRecordReq
} from '../../../api/web/model/checkinModel'
import moment from 'moment'
import { randomNumberString } from '../../../util/utils'
import { DeleteOutlined, ExclamationCircleOutlined, FormOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { Modal } from 'ant-design-vue'

// eslint-disable-next-line no-undef
const props = defineProps<{
  courseId: number
}>()

// 表格列项
const columnCheckinRecord: columnType[] = [
  {
    title: '名称',
    dataIndex: 'checkinName',
    width: '150px'
  },
  {
    title: '密钥',
    dataIndex: 'checkinKey',
    width: '80px'
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    slots: { customRender: 'createdAt' },
    width: '100px'
  },
  {
    title: '出勤比例',
    dataIndex: 'attendance',
    slots: { customRender: 'attendance' },
    width: '100px'
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
  defaultParams: [{
    courseId: props.courseId
  }]
})

// 分页数据
const pagListCheckinRecord = computed<pagination>(() => ({
  onChange (page: number) {
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
    dataIndex: 'userDetail.username',
    width: '100px'
  },
  {
    title: '学号',
    dataIndex: 'userDetail.userNum',
    width: '100px'
  },
  {
    title: '是否签到',
    dataIndex: 'userDetail.isCheckin',
    slots: { customRender: 'isCheckin' },
    width: '100px'
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
const pag = computed<pagination>(() => ({
  size: 'small',
  onChange (page: number) {
    currentListCheckinDetail.value = page
  },
  total: totalListCheckinDetail.value,
  pageSize: pageSizeListCheckinDetail.value
}))

const handleExpand = (expanded: boolean, record: ListCheckinRecordResp) => {
  // 展开时开始加载
  if (expanded) {
    // 获取数据
    runListCheckinDetail({
      checkinRecordId: record.checkinRecordId
    })
  }
}

// 修改签到记录
const {
  run: runUpdateCheckinDetail,
  queries: queriesUpdateCheckinDetail
} = useRequest(apiUpdateCheckinDetailByCheckinDetailId, {
  formatResult: (res) => {
    return res.data.result
  },
  queryKey: updateCheckinDetailReq => String(updateCheckinDetailReq.checkinDetailId)
})

const handleUpdateCheckinDetail = async (checkinDetailId: number, isCheckin: boolean) => {
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
  run: runInsertCheckin,
  loading: loadingInsertCheckin,
  error: errInsertCheckin
} = useRequest(ApiInsertCheckinRecord)

// 插入框数据
const insertCheckinState = reactive<InsertCheckinRecordReq>({
  checkinName: moment().format('YYYY-MM-DD') + '签到',
  checkinKey: randomNumberString(6),
  duration: 30,
  courseId: props.courseId
})

const handleInsertCheckinRecord = async () => {
  await runInsertCheckin(insertCheckinState)
  if (errInsertCheckin.value) {
    return
  }
  visibleModal.value = false
  await refreshListCheckinRecord()
}

const {
  run: runDeleteCheckinRecords,
  loading: loadingDeleteCheckinRecords,
  error: errDeleteCheckinRecords
} = useRequest(ApiDeleteCheckinRecords)

const selectedRowKeys = ref<number[]>([])

const onSelectChange = (keys: number[]) => {
  selectedRowKeys.value = keys
}

const handleDeleteCheckinRecords = async () => {
  Modal.confirm({
    title: '确认删除签到记录？',
    icon: createVNode(ExclamationCircleOutlined),
    content: '删除签到记录将会删除在该签到下的详情，请谨慎操作！',
    okText: '确认',
    okButtonProps: { loading: loadingDeleteCheckinRecords.value },
    onOk: async () => {
      await runDeleteCheckinRecords({ checkinRecordIds: selectedRowKeys.value })
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
