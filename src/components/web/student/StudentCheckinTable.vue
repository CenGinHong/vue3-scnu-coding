<template>
  <div :class="style.outer">
    <a-space :class="style.btnSpace">
      <a-button type="primary" @click="handleVisibleModal">
        <form-outlined />
        进行签到
      </a-button>
      <a-button @click="handleRefreshStuGetCheckinByCourseId">
        <reload-outlined />
        刷新
      </a-button>
    </a-space>
    <a-table
      :columns="columns"
      :data-source="dataCheckInList?.records"
      :loading="loadingCheckInList"
      :pagination="pag"
      :row-key="(record) => record.checkinRecordId"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'createdAt'">
          {{ dayjs(record.createdAt).format('YYYY-MM-DD hh:mm') }}
        </template>
        <template v-if="column.dataIndex === 'isCheckin'">
          <template v-if="record.checkinDetail.isCheckin">
            <a-tag color="success">已签</a-tag>
          </template>
          <template v-else>
            <a-tag color="error">未签</a-tag>
          </template>
        </template>
      </template>
    </a-table>
    <a-modal
      v-model:visible="visibleModal"
      :confirmLoading="loadingCheckin"
      :ok="handleCheckin"
      :ok-button-props="{ disabled: !dataCheckinStatus }"
      cancelText="关闭"
      ok-text="签到"
      title="进行签到"
    >
      <template v-if="dataCheckinStatus">
        <div :class="style.modalContent">
          <a-progress :percent="percent" type="circle" />
          <p>{{ dataCheckinStatus.checkinName }}</p>
          <a-input
            v-model:value="checkinKey"
            :max-length="6"
            class="keyInput"
            placeholder="输入签到密钥"
          />
        </div>
      </template>
      <template v-else>
        <a-result title="签到尚未开始"> </a-result>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { computed, ref, useCssModule } from 'vue'
import { columnType } from '../../../api/common'
import { usePagination, useRequest } from 'vue-request'
import { FormOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import {
  apiCheckIn,
  apiGetCheckinStatus,
  apiStuGetCheckinByCourseId
} from '../../../api/web/checkin'
import { useRoute } from 'vue-router'

const columns: columnType[] = [
  {
    title: '签到名称',
    dataIndex: 'checkinName',
    width: '40%'
  },
  {
    title: '签到时间',
    dataIndex: 'createdAt',
    width: '40%'
  },
  {
    title: '是否按时签到',
    dataIndex: 'isCheckin',
    width: '20%'
  }
]
const route = useRoute()
const courseId = Number(route.params.courseId)
// 获取本人签到参与情况
const {
  data: dataCheckInList,
  loading: loadingCheckInList,
  current,
  pageSize,
  total,
  refresh: refreshStuGetCheckinByCourseId
} = usePagination(apiStuGetCheckinByCourseId, {
  manual: false,
  formatResult: (res) => {
    return res.data.result
  }
})

const handleRefreshStuGetCheckinByCourseId = () => {
  refreshStuGetCheckinByCourseId()
}

// 分页数据
const pag = computed(() => ({
  onChange: (page: number) => {
    current.value = page
  },
  total: total.value,
  pageSize: pageSize.value
}))

// 控制签到框的可见性
const visibleModal = ref<boolean>(false)
// 倒计时百分比
const percent = ref<number>(0)
let timer: any = null
// 轮询获取
const {
  data: dataCheckinStatus,
  run: runGetCheckinStatus,
  cancel: cancelGetCheckinStatus,
  mutate: mutateGetCheckinStatus
} = usePagination(apiGetCheckinStatus, {
  pollingInterval: 1000,
  formatResult: (res) => {
    return res.data.result
  },
  onSuccess: (res) => {
    // 如果有数据，停止轮询
    if (res) {
      cancelGetCheckinStatus()
      // 倒计时,计算出允许签到的百分比
      clearInterval(timer)
      timer = setInterval(() => {
        res.remainDuration--
        if (res.remainDuration > 0) {
          percent.value = Math.ceil(
            (res.remainDuration / res.totalDuration) * 100
          )
        } else {
          clearInterval(timer)
          mutateGetCheckinStatus(undefined)
        }
      }, 1000)
    }
  }
})
const handleVisibleModal = () => {
  visibleModal.value = true
  // 开始轮询
  runGetCheckinStatus({
    courseId
  })
}

// 签到密钥
const checkinKey = ref<string>('')
const {
  run: runCheckin,
  loading: loadingCheckin,
  error: errorCheckin
} = useRequest(apiCheckIn)
// 签到行为
const handleCheckin = async() => {
  await runCheckin({
    courseId,
    checkinKey: checkinKey.value
  })
  if (!errorCheckin) {
    visibleModal.value = false
  }
}

const style = useCssModule()
</script>

<style lang="scss" module>
.outer {
  .btnSpace {
    margin-bottom: 16px;
    display: flex;
  }
}

.modalContent {
  display: flex;
  flex-direction: column;
  align-items: center;

  p {
    margin-top: 20px;
  }

  .keyInput {
    width: 150px;
  }
}
</style>
