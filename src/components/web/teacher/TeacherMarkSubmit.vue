<template>
  <div :class="style.outer">
    <a-radio-group v-model:value="markTypeActiveKey" :class="style.markType" button-style="solid">
      <a-radio-button value='0'>查看所有</a-radio-button>
      <a-radio-button value='1'>仅查看已完成</a-radio-button>
      <a-radio-button value='2'>仅查看已完成且未评分</a-radio-button>
      <a-select
          v-model:value="selectedStudent"
          :class="style.selectStudent"
          :filter-option="handleFilterOption"
          :loading="loadingLabSubmitId"
          :options="options"
          option-filter-prop="label"
          placeholder="选择学生"
          show-search>
      </a-select>
      <a-button
          :disabled="disableLast"
          @click="handleLast">
        <left-outlined/>
      </a-button>
      <a-button
          :disabled="disableNext"
          @click="handleNext">
        <right-outlined/>
      </a-button>
      <a-popover v-model:visible="visiblePopover" placement="left" title="评分" trigger="click">
        <template #content>
          <a-textarea
              :auto-size="{ minRows: 2, maxRows: 5 }"
              placeholder="Autosize height with minimum and maximum number of lines"
          />
          <a-input-number id="inputNumber" :max="100" :min="0"/>
          <a-button :class="style.markBtn" type="primary">
            <check-outlined/>
            评分
          </a-button>
        </template>
        <a-button :class="style.markBtn" type="primary">
          <check-outlined/>
          评分
        </a-button>
      </a-popover>
    </a-radio-group>
    <a-tabs v-model:activeKey="markContentActiveKey" type="card">
      <a-tab-pane key="0" tab="实验源码">
        <a-spin :spinning="loadingGetLabCode">
          <template v-if="labCode?.length===0">
            <a-empty :image="Empty.PRESENTED_IMAGE_SIMPLE"/>
          </template>
          <template v-else>
            <!--评论编辑框-->
            <program-read-board :code="labCode"/>
          </template>
        </a-spin>
      </a-tab-pane>
      <a-tab-pane key="1" tab="实验报告">
        <a-spin :spinning="loadingGetReportContent">
          <template v-if="reportContent===''">
            <a-empty :image="Empty.PRESENTED_IMAGE_SIMPLE"/>
          </template>
          <template v-else>
            <!--md预览-->
            <v-md-editor :model-value="reportContent" height="800px" mode="preview"></v-md-editor>
          </template>
        </a-spin>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, useCssModule, watch } from 'vue'
import { CheckOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons-vue'
import { useRequest } from 'vue-request'
import { apiListLabSubmit, apiGetLabCode, apiGetReportContent } from '../../../api/web/labSubmit'
import { selectType } from '../../../api/common'
import { code, listLabSubmitResp } from '../../../api/web/model/labSubmit'
import ProgramReadBoard from '../ProgramReadBoard.vue'
import { Empty } from 'ant-design-vue'

// eslint-disable-next-line no-undef
const props = defineProps<{
  labId: number
}>()

// 学生下拉列表
interface selectItem extends selectType {
  userId: number
}

// 控制查看哪种学生
const markTypeActiveKey = ref<string>('0')
// 控制查看源码还是实验报告
const markContentActiveKey = ref<string>('0')
// 被选中的学生
const selectedStudent = ref<string>('')
// 学生下拉列表列表属性
const options = ref<selectItem[]>([])
// 获取学生提交信息
const {
  data: dataLabSubmitId,
  loading: loadingLabSubmitId
} = useRequest(apiListLabSubmit, {
  manual: false,
  defaultParams: [{
    labId: props.labId
  }],
  // 筛选
  formatResult: (res) => {
    return res.data.result
  },
  // 修改option的内容
  onSuccess: (res) => {
    options.value = []
    const temp = res
    for (let i = 0; i < temp.length; i++) {
      const item = temp[i]
      options.value.push({
        label: item.userDetail.username + '    ' + item.userDetail.userNum,
        value: String(i),
        userId: item.userDetail.userId
      })
    }
  }
})

// 在下拉列表中筛选学生
const handleFilterOption = (input: string, option: selectType) => {
  // 选项不可用
  if (option.disabled) {
    return false
  }
  return option.label.indexOf(input) >= 0
}
// 不允许跳转到下一个
const disableNext = computed<boolean>(() => {
  if (options.value.length === 0) {
    return true
  }
  if (selectedStudent.value === '' && options.value.length > 0) {
    return false
  }
  return Number(selectedStudent.value) >= options.value.length - 1
})
// 不允许跳转到上一个
const disableLast = computed<boolean>(() => {
  if (options.value.length === 0) {
    return true
  }
  return Number(selectedStudent.value) <= 0
})
// 学生列表跳转到下一个
const handleNext = () => {
  if (selectedStudent.value === '') {
    selectedStudent.value = '0'
  } else {
    selectedStudent.value = String(Number(selectedStudent.value) + 1)
  }
}
// 学生列表跳到上一个
const handleLast = () => {
  selectedStudent.value = String(Number(selectedStudent.value) - 1)
}
// 当tag改变时要修改学生列表
watch(() => markTypeActiveKey.value, (newValue: string) => {
  selectedStudent.value = ''
  options.value = []
  if (dataLabSubmitId.value) {
    let temp: listLabSubmitResp[] = []
    switch (newValue) {
      case '0': {
        temp = dataLabSubmitId.value
        break
      }
      case '1': {
        temp = dataLabSubmitId.value.filter(item => {
          return item.isFinish
        })
        break
      }
      case '2': {
        temp = dataLabSubmitId.value.filter(item => {
          return item.isFinish && item.score === -1
        })
        break
      }
    }
    for (let i = 0; i < temp.length; i++) {
      const item = temp[i]
      options.value.push({
        label: item.userDetail.username + '    ' + item.userDetail.userNum,
        value: String(i),
        userId: item.userDetail.userId
      })
    }
  }
})

// 获取报告
const {
  run: runGetReportContent,
  data: dataGetReportContent,
  loading: loadingGetReportContent,
  error: errGetReportContent
} = useRequest(apiGetReportContent, {
  formatResult: (res) => {
    return res.data.result
  }
})

// 报告内容
const reportContent = ref<string>('')

const {
  run: runGetLabCode,
  data: dataGetLabCode,
  loading: loadingGetLabCode,
  error: errGetLabCode
} = useRequest(apiGetLabCode, {
  formatResult: (res) => {
    return res.data.result
  }
})
// 实验代码
const labCode = ref<code[]>([])
// 选择的学生改变时，更新实验报告
watch(() => selectedStudent.value, async (newValue) => {
  if (newValue === '') {
    reportContent.value = ''
    labCode.value = []
  } else {
    await runGetLabCode({ labId: props.labId, userId: options.value[Number(selectedStudent.value)].userId })
    if (errGetLabCode.value) {
      return
    }
    labCode.value = dataGetLabCode.value!.code
    await runGetReportContent({
      labId: props.labId,
      userId: options.value[Number(selectedStudent.value)].userId
    })
    if (errGetReportContent.value) {
      return
    }
    reportContent.value = dataGetReportContent.value!.reportContent
  }
})
// 选择的学生改变时，更新实验代码

const visiblePopover = ref<boolean>(false)

const style = useCssModule()

</script>

<style lang="scss" module>

.outer {
  height: auto;

  .markType {
    display: flex;
    margin-bottom: 50px;

    .inputStudentNum {
      margin-left: 20px;
      width: 200px;
    }

    .markBtn {
      margin-left: 30px;
    }

    .selectStudent {
      text-align: left;
      margin-left: 30px;
      width: 240px;
    }
  }
}
</style>

<style lang="scss" scoped>
::v-deep(.ant-tabs-nav-scroll) {
  margin-left: 0 !important;
}
</style>
