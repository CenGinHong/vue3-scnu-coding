<template>
  <div class="outer">
    <a-radio-group
        v-model:value="markTypeActiveKey"
        class="correctType"
        button-style="solid"
    >
      <a-radio-button value="0">查看所有</a-radio-button>
      <a-radio-button value="1">仅查看已完成</a-radio-button>
      <a-radio-button value="2">仅查看已完成且未评分</a-radio-button>
      <a-select
          v-model:value="selectedStudent"
          class="selectStudent"
          :filter-option="handleFilterOption"
          :loading="loadingLabSubmit"
          :options="options"
          option-filter-prop="label"
          placeholder="选择学生"
          show-search
      >
      </a-select>
      <a-button :disabled="disableLast" @click="handleLast">
        <left-outlined/>
      </a-button>
      <a-button :disabled="disableNext" @click="handleNext">
        <right-outlined/>
      </a-button>
      <a-button @click="handleRefreshLabSubmitId">
        <reload-outlined/>
      </a-button>
      <a-button
          class="correctBtn"
          :disabled="selectedStudent === ''"
          type="primary"
          @click="handleShowModalCorrect"
      >
        <check-outlined/>
        评分
      </a-button>
    </a-radio-group>
    <a-tabs v-model:activeKey="markContentActiveKey" type="card">
      <a-tab-pane key="0" tab="实验源码">
        <a-spin :spinning="loadingGetLabCode">
          <a-empty v-if="labCode?.length === 0" :image="Empty.PRESENTED_IMAGE_SIMPLE"/>
          <template v-else>
            <a-button class="actionButton" type="primary"
            >IDE打开
            </a-button
            >
            <program-read-board class="codeBoard" :code="labCode"/>
          </template>
        </a-spin>
      </a-tab-pane>
      <a-tab-pane key="1" tab="实验报告">
        <a-spin :spinning="loadingGetReportContent">
          <a-empty v-if="reportContent === ''" :image="Empty.PRESENTED_IMAGE_SIMPLE"/>
          <template v-else>
            <a-button class="actionButton" type="primary" @click="handle"
            >导出为pdf
            </a-button
            >
            <div class="reportContent">
              <v-md-editor
                  :model-value="reportContent"
                  height="500px"
                  mode="preview"
              />
              <p v-html="html"/>
            </div>
          </template>
        </a-spin>
      </a-tab-pane>
    </a-tabs>
  </div>
  <a-modal
      v-model:visible="visibleModalCorrect"
      :ok-button-props="{ loading: loadingCorrect }"
      cancelText="取消"
      ok-text="确认"
      title="评分"
      @ok="handleUpdateCommentAndScore"
  >
    <a-form
        :label-col="{ span: 4 }"
        :model="correctState"
        :wrapper-col="{ span: 18 }"
        name="custom-validation"
    >
      <a-form-item label="分数" name="score">
        <a-input-number
            v-model:value="correctState.score"
            :max="100"
            :min="0"
        />
      </a-form-item>
      <a-form-item label="评语" name="comment">
        <a-textarea
            v-model:value="correctState.comment"
            :maxlength="250"
            :rows="4"
            show-count
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue'
import {
  CheckOutlined,
  LeftOutlined,
  RightOutlined,
  ReloadOutlined
} from '@ant-design/icons-vue'
import { useRequest } from 'vue-request'
import {
  apiCorrect,
  apiGetLabCode,
  apiGetReportContent,
  apiListLabSubmit
} from '../../../api/web/labSubmit'
import { selectType } from '../../../api/common'
import {
  code,
  correctLabReq,
  listLabSubmitResp
} from '../../../api/web/model/labSubmit'
import ProgramReadBoard from '../ProgramReadBoard.vue'
import { Empty } from 'ant-design-vue'
import VueMarkdownEditor, { xss } from '@kangc/v-md-editor'

// eslint-disable-next-line no-undef
const props = defineProps<{
  labId: number
}>()

// 学生下拉列表
interface selectItem extends selectType {
  userId: number
  score?: number
  comment?: string
}

// 控制查看哪种学生
const markTypeActiveKey = ref<string>('')
// 控制查看源码还是实验报告
const markContentActiveKey = ref<string>('0')
// 被选中的学生
const selectedStudent = ref<string>('')
// 学生下拉列表列表属性
const options = ref<selectItem[]>([])
// 获取学生提交信息
const {
  data: dataLabSubmit,
  loading: loadingLabSubmit,
  refresh: refreshLabSubmit
} = useRequest(apiListLabSubmit, {
  manual: false,
  defaultParams: [
    {
      labId: props.labId
    }
  ],
  // 筛选
  formatResult: (res) => {
    return res.data.result
  }
})

const handleRefreshLabSubmitId = () => {
  refreshLabSubmit()
}

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
watch(
  () => markTypeActiveKey.value,
  (newValue: string) => {
    selectedStudent.value = ''
    if (dataLabSubmit.value) {
      let temp: listLabSubmitResp[] = []
      switch (newValue) {
        // 全部学生
        case '0': {
          temp = dataLabSubmit.value.records
          break
        }
        // 已经提交的学生
        case '1': {
          temp = dataLabSubmit.value.records.filter((item) => {
            return item.labSubmitDetail !== undefined
          })
          break
        }
        // 提交但未评分
        case '2': {
          temp = dataLabSubmit.value.records.filter((item) => {
            return (
              item.labSubmitDetail !== undefined &&
                  item.labSubmitDetail.score === 0
            )
          })
          break
        }
      }
      options.value = []
      options.value.push(
        ...temp.map((item, index) => {
          return {
            label: item.userDetail.username + '    ' + item.userDetail.userNum,
            value: String(index),
            userId: item.userId,
            score: item.labSubmitDetail?.score,
            comment: item.labSubmitDetail?.labSubmitComment
          }
        })
      )
    }
  }
)

// 获取报告
const { run: runGetReportContent, loading: loadingGetReportContent } =
    useRequest(apiGetReportContent, {
      formatResult: (res) => {
        return res.data.result
      }
    })

// 报告内容
const reportContent = ref<string>('')

const { run: runGetLabCode, loading: loadingGetLabCode } = useRequest(
  apiGetLabCode,
  {
    formatResult: (res) => {
      console.log(res)
      return res.data.result
    }
  }
)
// 实验代码
const labCode = ref<code[]>([])
// 选择的学生改变时，更新实验报告
watch(
  () => selectedStudent.value,
  (newValue) => {
    if (newValue === '') {
      reportContent.value = ''
      labCode.value = []
    } else {
      runGetLabCode({
        labId: props.labId,
        userId: options.value[Number(selectedStudent.value)].userId
      }).then((res) => {
        labCode.value = res!.code
      })
      runGetReportContent({
        labId: props.labId,
        userId: options.value[Number(selectedStudent.value)].userId
      }).then((res) => {
        reportContent.value = res!.reportContent
      })
    }
  }
)
// 选择的学生改变时，更新实验代码

const correctState = reactive<correctLabReq>({
  comment: '',
  score: 0,
  userId: 0,
  labId: props.labId
})

const visibleModalCorrect = ref<boolean>(false)

const handleShowModalCorrect = () => {
  correctState.userId = options.value[Number(selectedStudent.value)].userId
  correctState.comment =
      options.value[Number(selectedStudent.value)].comment ?? ''
  correctState.score = options.value[Number(selectedStudent.value)].score ?? 0
  visibleModalCorrect.value = true
}

const {
  run: runCorrect,
  error: errCorrect,
  loading: loadingCorrect
} = useRequest(apiCorrect)

const handleUpdateCommentAndScore = async() => {
  await runCorrect(correctState)
  if (errCorrect.value) {
    return
  }
  // 先原地更新
  options.value[Number(selectedStudent.value)].score = correctState.score
  options.value[Number(selectedStudent.value)].comment = correctState.comment
  visibleModalCorrect.value = false
  await refreshLabSubmit()
}

// 调用方法将 markdown 转换成 html 并使用 xss 过滤
// Vue3

const html = ref()

</script>

<style lang="scss" scoped>
.outer {
  height: auto;

  .correctType {
    display: flex;
    margin-bottom: 50px;
    padding-left: 16px;

    .inputStudentNum {
      margin-left: 20px;
      width: 200px;
    }

    .correctBtn {
      margin-left: 30px;
    }

    .submitBtn {
      float: right;
    }

    .selectStudent {
      text-align: left;
      margin-left: 30px;
      width: 240px;
    }
  }

  .reportContent {
    text-align: left;
  }

  .actionButton {
    margin-left: 36px;
    display: flex;
  }

  .codeBoard {
    margin: 16px 36px 0 36px;
  }
}
</style>
