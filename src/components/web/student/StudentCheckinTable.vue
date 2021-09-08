<template>
  <div class="outer">
    <a-button class="checkinButton" type="primary" @click="handleVisibleModal">进行签到</a-button>
    <a-table
        :columns="columns"
        :row-key="record => record.checkinRecordId"
        :data-source="dataCheckInList?.records"
        :pagination="pagination"
        :loading="loadingCheckInList">
      <template #isCheckin="{ record }">
        <template v-if="record.checkinDetail.isCheckin">
          <a-tag color="success">已签</a-tag>
        </template>
        <template v-else>
          <a-tag color="error">未签</a-tag>
        </template>
      </template>
      <template #createdAt="{ text }">
        {{ moment(text).format('YYYY-MM-DD hh:mm') }}
      </template>
    </a-table>
    <a-modal
        title="进行签到"
        v-model:visible="visibleModal"
        ok-text="签到"
        cancelText="关闭"
        :confirmLoading="loadingCheckin"
        :ok-button-props="{ disabled: !dataCheckinStatus }"
        :ok="handleCheckin">
      <template v-if="dataCheckinStatus">
        <div class="modalContent">
          <a-progress type="circle" :percent="percent"/>
          <p> {{ dataCheckinStatus.checkinName }} </p>
          <a-input class="keyInput" v-model:value="checkinKey" :max-length=6 placeholder="输入签到密钥"/>
        </div>
      </template>
      <template v-else>
        <a-result title="签到尚未开始">
        </a-result>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts">
import moment from 'moment'
import { computed, defineComponent, ref } from 'vue'
import { columnType, pagination } from '../../../api/common'
import { usePagination, useRequest } from 'vue-request'
import { ApiCheckIn, ApiGetCheckinStatus, ApiStuGetCheckinByCourseId } from '../../../api/web/checkin'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'StudentCheckinTable',
  setup () {
    const columns: columnType[] = [
      {
        title: '签到名称',
        dataIndex: 'checkinName',
        width: '40%'
      },
      {
        title: '签到时间',
        dataIndex: 'createdAt',
        slots: { customRender: 'createdAt' },
        width: '40%'
      },
      {
        title: '是否按时签到',
        dataIndex: 'isCheckIn',
        slots: { customRender: 'isCheckin' },
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
      total
    } = usePagination(ApiStuGetCheckinByCourseId, {
      manual: false,
      formatResult: (res) => {
        return res.data.result
      }
    })

    // 分页数据
    const pagination = computed<pagination>(() => ({
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
    } = usePagination(ApiGetCheckinStatus, {
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
              percent.value = Math.ceil((res.remainDuration / res.totalDuration) * 100)
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
    } = useRequest(ApiCheckIn)
    // 签到行为
    const handleCheckin = async () => {
      await runCheckin({
        courseId,
        checkinKey: checkinKey.value
      })
      if (!errorCheckin) {
        visibleModal.value = false
      }
    }
    return {
      columns,
      pagination,
      loadingCheckInList,
      dataCheckInList,
      visibleModal,
      dataCheckinStatus,
      checkinKey,
      percent,
      loadingCheckin,
      handleCheckin,
      handleVisibleModal,
      moment
    }
  }

})
</script>

<style lang="scss" scoped>

.outer {

  .checkinButton {
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
