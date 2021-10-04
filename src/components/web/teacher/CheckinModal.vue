<template>
  <a-modal
    :visible="visible"
    cancelText="关闭"
    :destroyOnClose="true"
    ok-text="创建"
    title="创建签到"
    @cancel="handleCancel"
    @ok="handleInsertCheckinRecord"
  >
    <a-form
      :label-col="{ span: 4 }"
      :model="insertCheckinState"
      :ok-button-props="{ loading: loadingInsertCheckin }"
      :rules="rules"
      :wrapper-col="{ span: 18 }"
      name="custom-validation"
    >
      <a-form-item label="签到名称" name="checkinName">
        <a-input v-model:value="insertCheckinState.checkinName" />
      </a-form-item>
      <a-form-item label="签到时长" name="duration">
        <a-radio-group
          v-model:value="insertCheckinState.duration"
          button-style="solid"
        >
          <a-radio-button :value=15>15秒</a-radio-button>
          <a-radio-button :value=30>30秒</a-radio-button>
          <a-radio-button :value=90>90秒</a-radio-button>
          <a-radio-button :value=120>120秒</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="签到密钥" name="checkinKey">
        <a-input v-model:value="insertCheckinState.checkinKey" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script lang="ts" setup>
import { useRequest } from 'vue-request'
import { apiInsertCheckinRecord } from '../../../api/web/checkin'
import { reactive } from 'vue'
import { insertCheckinRecordReq } from '../../../api/web/model/checkinModel'
import dayjs from 'dayjs'
import { randomNumberString } from '../../../util/utils'
import { Form, message } from 'ant-design-vue'

const useForm = Form.useForm

// eslint-disable-next-line no-undef
const props = defineProps<{
  courseId: number
  visible: boolean
}>()

// eslint-disable-next-line no-undef,func-call-spacing
const emits = defineEmits<{
  (e:'update:visible', src:boolean):void
  (e:'refreshList'):void
}>()

const {
  run: runInsertCheckin,
  loading: loadingInsertCheckin,
  error: errInsertCheckin
} = useRequest(apiInsertCheckinRecord)

// 插入框数据
const insertCheckinState = reactive<insertCheckinRecordReq>({
  checkinName: dayjs().format('YYYY-MM-DD') + '签到',
  checkinKey: randomNumberString(6),
  duration: 30,
  courseId: props.courseId
})

const rules = reactive({
  checkinName: [
    { required: true, message: '请输入标题' },
    { max: 16, message: '标题最长不能超16字' }
  ],
  checkinKey: [
    { required: true, message: '签到码需为6位数字' },
    {
      pattern: /^\d{6}$/,
      message: '签到码需为6位数字'
    }
  ]
})

const { validate: validateInsertCheckin } = useForm(insertCheckinState, rules)

const handleInsertCheckinRecord = async() => {
  try {
    await validateInsertCheckin()
  } catch (error) {
    message.error('输入数据不满足提交要求')
    return
  }
  await runInsertCheckin(insertCheckinState)
  if (errInsertCheckin.value) {
    return
  }
  emits('refreshList')
  handleCancel()
}

const handleCancel = () => {
  emits('update:visible', false)
}
</script>

<style scoped></style>
