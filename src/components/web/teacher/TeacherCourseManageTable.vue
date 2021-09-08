<template>
  <div :class="style.btnArea">
    <a-space>
      <a-button type="primary" @click="visibleModalAddStudent=true">
        <user-add-outlined/>
        导入学生
      </a-button>
      <a-button :disabled="hasSelected" danger @click="handleDelete">
        <user-delete-outlined/>
        移出课程
      </a-button>
    </a-space>
  </div>
  <a-table
      :columns="columns"
      :data-source="dataListCourseOverview?.records"
      :loading="loadingListCourseOverview"
      :pagination="pag"
      :row-key="record => record.userDetail.userId"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }">
    <template #checkinDetail="{ record }">
      {{ record.checkinDetail.checkinCount }} / {{ record.checkinDetail.totalCount }}
    </template>
    <template #score="{ record }">
      <a-popover
          :title="record.userDetail.username + '的实验成绩' "
          trigger="click"
          @visibleChange="handleClickChange($event,record.userDetail.userId)">
        <template #content>
          <a-table :columns="columnsListOneStudentScore" :data-source="dataListOneStudentScore?.records"
                   :loading="loadingListOneStudentScore"
                   :pagination="paginationListOneStudentScore" :row-key="record => record.labSubmitDetail.labSubmitId"
                   size="small">
            <template #score="{ text }">
              <a-tag :color="scoreTagColor(text)">
                {{ text }}
              </a-tag>
            </template>
          </a-table>
        </template>
        <a-tooltip title="点击查看详情成绩">
          <a-tag :color="scoreTagColor(record.avgScoreDetail.score)">
            {{ record.avgScoreDetail.score }}
          </a-tag>
        </a-tooltip>
      </a-popover>
    </template>
    <template #codingTime="{record}">
      <a-popover
          :title="record.userDetail.username + '的编码时间' "
          trigger="click"
          @visibleChange="handleClickChange($event,record.userDetail.userId)">
        <template #content>
          <a-tooltip title="点击查看热力图">
            <e-charts :autoresize=true :class="style.echarts" :loading="loadingCodingTime" :option="option"></e-charts>
          </a-tooltip>
        </template>
        <a-tag :color="gary">
          {{ record.codingTimeDetail.codingTime }}
        </a-tag>
      </a-popover>
    </template>
  </a-table>

  <a-modal v-model:visible="visibleModalAddStudent"
           :ok-button-props="{loading: loadingInsertStudent2Class}"
           cancel-text="取消"
           ok-text="导入"
           title="导入学生"
           @ok="handleAddStudent2Class">
    <a-textarea v-model:value="insertStudent2ClassNums" placeholder="请输入学生学号，每一行为一位学生" rows="4"/>
  </a-modal>
  <a-modal v-model:visible="visibleModalConfirmStudent"
           :footer="null"
           width="1000px">
    导入成功：
    <a-table :columns="confirmStudentColumns"
             :data-source="dataInsertStudent2Class?.successRecords"
             :row-key="record => record.userId">
      <template v-if="dataInsertStudent2Class?.errorStudentNums.length!==0">
        另外此次导入共{{ dataInsertStudent2Class?.errorStudentNums.length }}为同学未能找到对应信息导入失败
        <template v-for="(item) in dataInsertStudent2Class?.errorStudentNums">
          {{ item }}
        </template>
      </template>
    </a-table>
  </a-modal>
</template>

<script lang="ts" setup>
import { computed, createVNode, ref, useCssModule } from 'vue'
import { columnType, pagination } from '../../../api/common'
import { usePagination, useRequest } from 'vue-request'
import { apiInsertStudent2Class, apiListCourseOverview, apiRemoveStudentFromClass } from '../../../api/web/course'
import { ExclamationCircleOutlined, UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import ECharts from 'vue-echarts'
import { scoreTagColor } from '../../../util/utils'
import { apiListOneStudentScoreResp } from '../../../api/web/lab'
import { apiGetCodingTime } from '../../../api/web/user'
import { use } from 'echarts/core'
import { CalendarComponent, TitleComponent, TooltipComponent, VisualMapComponent } from 'echarts/components'
import { HeatmapChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'

use([
  TitleComponent,
  CalendarComponent,
  TooltipComponent,
  VisualMapComponent,
  HeatmapChart,
  CanvasRenderer
])

// eslint-disable-next-line no-undef
const props = defineProps<{
  courseId: number
}>()

const columns: columnType[] = [
  {
    title: '姓名',
    dataIndex: 'userDetail.username',
    width: '8%'
  }, {
    title: '学号',
    dataIndex: 'userDetail.userNum',
    width: '13%'
  }, {
    title: '年级',
    dataIndex: 'userDetail.grade',
    width: '7%'
  },
  {
    title: '学院',
    dataIndex: 'userDetail.school',
    width: '12%'
  }, {
    title: '班级',
    dataIndex: 'userDetail.organization',
    width: '18%'
  },
  {
    title: '专业',
    dataIndex: 'userDetail.major',
    width: '15%'
  }, {
    title: '平均成绩',
    dataIndex: 'avgScoreDetail.score',
    slots: { customRender: 'score' },
    width: '10%'
  }, {
    title: '签到参与',
    dataIndex: 'checkinDetail',
    slots: { customRender: 'checkinDetail' },
    width: '10%'
  }, {
    title: '编码时间（分钟）',
    dataIndex: 'codingTimeDetail.codingTime',
    slots: { customRender: 'codingTime' },
    width: '15%'
  }
]

// 列表总览
const {
  data: dataListCourseOverview,
  loading: loadingListCourseOverview,
  pageSize,
  current,
  total,
  refresh: refreshListCourseOverview
} = usePagination(apiListCourseOverview, {
  manual: false,
  formatResult: (res) => {
    return res.data.result
  },
  defaultParams: [{
    courseId: props.courseId
  }]
})

// 分页
const pag = computed<pagination>(() => ({
  onChange (page: number) {
    current.value = page
  },
  total: total.value,
  pageSize: pageSize.value
}))

// 选中要删除的学生
const selectedRowKeys = ref<number[]>([])
const hasSelected = computed(() => selectedRowKeys.value.length === 0)
const onSelectChange = (keys: number[]) => {
  selectedRowKeys.value = keys
}

const {
  run: runRemoveStudentFromClass,
  loading: loadingRemoveStudentFromClass,
  error: errRemoveStudentFromClass
} = useRequest(apiRemoveStudentFromClass)

const handleDelete = () => {
  Modal.confirm({
    title: '确认移出课程？',
    icon: createVNode(ExclamationCircleOutlined),
    content: '移出课程将会移除该学生在课程下的所有信息记录且不可恢复，请谨慎操作！',
    okText: '确认',
    cancelText: '取消',
    okButtonProps: { loading: loadingRemoveStudentFromClass.value },
    onOk: async () => {
      await runRemoveStudentFromClass({
        userIds: selectedRowKeys.value,
        courseId: props.courseId
      })
      if (errRemoveStudentFromClass.value) {
        return
      }
      await refreshListCourseOverview()
    }
  })
}

const {
  run: runListOneStudentScore,
  data: dataListOneStudentScore,
  loading: loadingListOneStudentScore,
  pageSize: pageSizeListOneStudentScore,
  current: currentListOneStudentScore,
  total: totalListOneStudentScore
} = usePagination(apiListOneStudentScoreResp, {
  formatResult: (res) => {
    return res.data.result
  }
})

// 分页
const paginationListOneStudentScore = computed<pagination>(() => ({
  size: 'small',
  onChange (page: number) {
    currentListOneStudentScore.value = page
  },
  total: totalListOneStudentScore.value,
  pageSize: pageSizeListOneStudentScore.value
}))

const columnsListOneStudentScore: columnType[] = [
  {
    title: '实验名称',
    dataIndex: 'title',
    width: '200px'
  }, {
    title: '成绩',
    dataIndex: 'labSubmitDetail.score',
    width: '50px',
    slots: { customRender: 'score' }
  }
]

const handleClickChange = (visible: boolean, studentId: number) => {
  if (visible) {
    runListOneStudentScore({
      studentId,
      courseId: props.courseId
    })
  }
}

const {
  run: runCodingTime,
  data: dataCodingTime,
  loading: loadingCodingTime
} = useRequest(apiGetCodingTime, {
  formatResult: (res) => {
    const ret: [string, number][] = []
    const record = res.data.result!.record
    for (const recordElement of record) {
      ret.push([recordElement.CreatedAt, recordElement.duration])
    }
    return ret
  }
})
// 日历图数据
const option = computed(() => {
  return {
    title: {
      show: true
    },
    tooltip: {},
    calendar: {
      top: 30,
      left: 10,
      cellSize: 13,
      range: new Date().getFullYear(),
      itemStyle: {
        borderWidth: 0.5
      },
      dayLabel: {
        show: false
      },
      monthLabel: {
        show: false
      },
      yearLabel: { show: false }
    },
    visualMap: {
      show: false
    },
    series: {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: dataCodingTime.value
    }
  }
})

const visibleModalAddStudent = ref<boolean>(false)
const insertStudent2ClassNums = ref<string>('')

const {
  data: dataInsertStudent2Class,
  loading: loadingInsertStudent2Class,
  run: runInsertStudent2Class,
  error: errInsertStudent2Class
} = useRequest(apiInsertStudent2Class, {
  formatResult: (res) => {
    return res.data.result
  }
})
const handleAddStudent2Class = async () => {
  if (insertStudent2ClassNums.value.trim() === '') {
    message.error('导入学号不能为空')
  }
  const studentNums = insertStudent2ClassNums.value.split('\n')
  await runInsertStudent2Class({ studentNums: studentNums, courseId: props.courseId })
  if (errInsertStudent2Class.value) {
    return
  }
  visibleModalAddStudent.value = false
  visibleModalConfirmStudent.value = true
  await refreshListCourseOverview()
}

// 确认信息框
const visibleModalConfirmStudent = ref<boolean>(false)

const confirmStudentColumns: columnType[] = [
  {
    title: '姓名',
    dataIndex: 'username',
    width: '7%'
  }, {
    title: '学号',
    dataIndex: 'userNum',
    width: '10%'
  }, {
    title: '年级',
    dataIndex: 'grade',
    width: '5%'
  }, {
    title: '学院',
    dataIndex: 'school',
    width: '10%'
  }, {
    title: '性别',
    dataIndex: 'gender',
    width: '3%'
  }, {
    title: '专业',
    dataIndex: 'major',
    width: '10%'
  }, {
    title: '班级',
    dataIndex: 'organization',
    width: '10%'
  }
]

const style = useCssModule()

</script>

<style lang="scss" module>
.btnArea {
  display: flex;
  margin-bottom: 20px;

}

.echarts {
  height: 150px;
  width: 700px;
}

.delBtu {
  color: #ff4d4f;
}

</style>
