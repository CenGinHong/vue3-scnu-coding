<template>
  <a-row v-if="dataCheckinStatus" align="center">
    <a-col align="center">
      <a-space direction="vertical">
        <a-progress :percent="percent" type="circle"/>
        <p>{{ dataCheckinStatus.checkinName }}</p>
        <a-input
            v-model:value="checkinKey"
            :max-length="6"
            class="keyInput"
            placeholder="输入签到密钥"
        >
          <template #enterButton>
            <a-button
                @click="handleCheckin" :loading="loadingCheckin">签到
            </a-button>
          </template>
        </a-input>
      </a-space>
    </a-col>
  </a-row>
  <a-result v-else title="签到尚未开始"/>
</template>

<script lang="ts" setup>
// 倒计时百分比
import { ref } from 'vue'
import { usePagination, useRequest } from 'vue-request'
import { apiCheckIn, apiGetCheckinStatus } from '../../../api/web/checkin'

// eslint-disable-next-line no-undef
const props = defineProps<{
  courseId: number
}>()

// eslint-disable-next-line no-undef,func-call-spacing
const emits = defineEmits<{
  (e: 'finish', res: boolean): void
}>()

// 签到密钥
const checkinKey = ref<string>('')

const percent = ref<number>(0)
let timer: any = null
// 轮询获取
const {
  data: dataCheckinStatus,
  run: runGetCheckinStatus,
  cancel: cancelGetCheckinStatus,
  mutate: mutateGetCheckinStatus
} = usePagination(apiGetCheckinStatus, {
  manual: false,
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

const {
  run: runCheckin,
  loading: loadingCheckin,
  error: errorCheckin
} = useRequest(apiCheckIn)
// 签到行为
const handleCheckin = async() => {
  await runCheckin({
    courseId: props.courseId,
    checkinKey: checkinKey.value
  })
  if (errorCheckin.value) {
    return
  }
  emits('finish', true)
}

</script>

<style lang="scss" scoped>

</style>
