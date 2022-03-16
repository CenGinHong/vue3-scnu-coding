<template>
  <div class="btnArea">
    <a-space>
      <a-button type="primary" @click="visibleModalAddStudent = true">
        <user-add-outlined/>
        导入学生
      </a-button>
      <a-button :disabled="hasSelected" danger @click="handleDelete">
        <user-delete-outlined/>
        移出课程
      </a-button>
      <a-button @click="handleShowModalExportScore">
        <export-outlined/>
        导出成绩表
      </a-button>
    </a-space>
  </div>
  <a-table
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :columns="columns"
      :data-source="dataListCourseOverview?.records"
      :loading="loadingListCourseOverview"
      :pagination="pag"
      :row-key="rowKey"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'checkinDetail'">
        {{ record.checkinDetail.checkinCount }} /
        {{ record.checkinDetail.totalCount }}
      </template>
      <template v-if="column.dataIndex === 'score'">
        <a-popover
            :title="record.userDetail.username + '的实验成绩'"
            trigger="click"
        >
          <template #content>
            <a-table
                :columns="columnsListOneStudentScore"
                :data-source="dataListOneStudentScore?.records"
                :loading="loadingListOneStudentScore"
                :pagination="pagListOneStudentScore"
                size="small"
            >
              <template #bodyCell="{ column,record }">
                <template v-if="column.key === 'score'">
                  <a-tag :color="scoreTagColor(record.labSubmitDetail.score)">
                    {{ record.labSubmitDetail.score }}
                  </a-tag>
                </template>
              </template>
            </a-table>
          </template>
          <a-tooltip title="点击查看详情成绩">
            <a-tag :color="scoreTagColor(record.avgScoreDetail.score)" @click="handleClickChange(record.userId)">
              {{ record.avgScoreDetail.score }}
            </a-tag>
          </a-tooltip>
        </a-popover>
      </template>
      <template v-if="column.dataIndex === 'codingTime'">
        <a-popover
            placement="topLeft"
            :title="record.userDetail.username + '的编码时间'"
            trigger="click"
        >
          <template #content>
            <coding-time-div
                :user-id="codingTimeUserId"
                :course-id="courseId"/>
          </template>
          <a-tooltip title="点击查看编码时间">
            <a-tag color="blue" @click="handleShowCodingTime(record.userId)">
              {{ record.codingTimeDetail.codingTime }}
            </a-tag>
          </a-tooltip>
        </a-popover>
      </template>
    </template>
  </a-table>
  <a-modal
      v-model:visible="visibleModalAddStudent"
      :ok-button-props="{ loading: loadingInsertStudent2Class }"
      cancel-text="取消"
      ok-text="导入"
      title="导入学生"
      @ok="handleAddStudent2Class"
  >
    <a-textarea
        v-model:value="insertStudent2ClassNums"
        placeholder="请输入学生学号，每一行为一位学生"
        rows="4"
    />
  </a-modal>
  <a-modal
      v-model:visible="visibleModalConfirmStudent"
      :footer="null"
      width="1000px"
  >
    导入成功：
    <a-table
        :columns="confirmStudentColumns"
        :data-source="dataInsertStudent2Class?.successRecords"
    >
      <template v-if="dataInsertStudent2Class?.errorStudentNums.length !== 0">
        另外此次导入共{{
          dataInsertStudent2Class?.errorStudentNums.length
        }}为同学未能找到对应信息导入失败
        <template v-for="item in dataInsertStudent2Class?.errorStudentNums">
          {{ item }}
        </template>
      </template>
    </a-table>
  </a-modal>
  <a-modal
      v-model:visible="visibleModalExportScore"
      :ok-button-props="{ loading: loadingExportScore }"
      cancel-text="取消"
      ok-text="导出"
      width="500px"
      @ok="handleExportScore"
  >
    <a-transfer
        :data-source="transferData"
        :selected-keys="transferSelectedKeys"
        :target-keys="transferTargetKeys"
        :titles="['全部实验', '导出成绩']"
        @change="handleTransferChange"
        @selectChange="handleTransferSelectChange"
    />
  </a-modal>
</template>

<script lang="ts" setup>
import { computed, createVNode, ref } from 'vue'
import { ITransfer } from '../../../api/common'
import { usePagination, useRequest } from 'vue-request'
import {
  apiInsertStudent2Class,
  apiListCourseOverview, apiListOneStudentScore,
  apiRemoveStudentFromClass
} from '../../../api/web/course'
import {
  ExclamationCircleOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  ExportOutlined
} from '@ant-design/icons-vue'
import { message, Modal, TablePaginationConfig } from 'ant-design-vue'

import { dataToFile, scoreTagColor } from '../../../util/utils'
import {
  apiListLabByCourseId
} from '../../../api/web/lab'
import { apiExportScore } from '../../../api/web/labSubmit'
import { ColumnType } from 'ant-design-vue/es/table'
import CodingTimeDiv from '../CodingTimeDiv.vue'
import { Key } from 'ant-design-vue/es/table/interface'
import { listCourseStudentOverviewResp } from '../../../api/web/model/courseModel'

const rowKey = (record: listCourseStudentOverviewResp) => {
  return record.userId
}

// eslint-disable-next-line no-undef
const props = defineProps<{
  courseId: number
}>()

const visible = ref(false)

const columns: ColumnType[] = [
  {
    title: '姓名',
    dataIndex: ['userDetail', 'username'],
    width: '8%'
  },
  {
    title: '学号',
    dataIndex: ['userDetail', 'userNum'],
    width: '13%'
  },
  {
    title: '年级',
    dataIndex: ['userDetail', 'grade'],
    width: '7%'
  },
  {
    title: '学院',
    dataIndex: ['userDetail', 'school'],
    width: '12%'
  },
  {
    title: '班级',
    dataIndex: ['userDetail', 'organization'],
    width: '18%'
  },
  {
    title: '专业',
    dataIndex: ['userDetail', 'major'],
    width: '15%'
  },
  {
    title: '平均成绩',
    dataIndex: 'score',
    width: '10%'
  },
  {
    title: '签到参与',
    dataIndex: 'checkinDetail',
    width: '10%'
  },
  {
    title: '编码时间（分钟）',
    dataIndex: 'codingTime',
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
  defaultParams: [
    {
      courseId: props.courseId
    }
  ]
})

// 分页
const pag = computed<TablePaginationConfig>(() => ({
  onChange(page: number) {
    current.value = page
  },
  total: total.value,
  pageSize: pageSize.value
}))

// 选中要删除的学生
const selectedRowKeys = ref<Key[]>([])

const hasSelected = computed<boolean>(() => selectedRowKeys.value.length === 0)

const onSelectChange = (keys: Key[]) => {
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
    content:
        '移出课程将会移除该学生在课程下的所有信息记录且不可恢复，请谨慎操作！',
    okText: '确认',
    cancelText: '取消',
    okButtonProps: { loading: loadingRemoveStudentFromClass.value },
    onOk: async() => {
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
} = usePagination(apiListOneStudentScore, {
  formatResult: (res) => {
    return res.data.result
  }
})

// 分页
const pagListOneStudentScore = computed(() => ({
  size: 'small',
  onChange(page: number) {
    currentListOneStudentScore.value = page
  },
  total: totalListOneStudentScore.value,
  pageSize: pageSizeListOneStudentScore.value
}))

const columnsListOneStudentScore: ColumnType[] = [
  {
    title: '实验名称',
    dataIndex: 'title',
    width: '80%'
  },
  {
    title: '成绩',
    dataIndex: ['labSubmitDetail', 'score'],
    key: 'score',
    width: '20%'
  }
]

const codingTimeUserId = ref<number>(0)

const handleShowModalCodingTime = (userId: number) => {
  codingTimeUserId.value = userId
  visible.value = true
}

const handleShowCodingTime = (userId: number) => {
  codingTimeUserId.value = userId
  visible.value = true
}

const handleClickChange = (studentId: number) => {
  runListOneStudentScore({
    userId: studentId,
    courseId: props.courseId
  })
}

const visibleModalAddStudent = ref<boolean>(false)
const insertStudent2ClassNums = ref<string>('')

const {
  data: dataInsertStudent2Class,
  loading: loadingInsertStudent2Class,
  run: runInsertStudent2Class,
  error: errInsertStudent2Class
} = useRequest(apiInsertStudent2Class, {
  formatResult: (res) => {
    return res.result
  }
})
// 导入学生
const handleAddStudent2Class = async() => {
  if (insertStudent2ClassNums.value.trim() === '') {
    message.error('导入学号不能为空')
  }
  const studentNums = insertStudent2ClassNums.value.split('\n')
  await runInsertStudent2Class({
    studentNums: studentNums,
    courseId: props.courseId
  })
  if (errInsertStudent2Class.value) {
    return
  }
  visibleModalAddStudent.value = false
  visibleModalConfirmStudent.value = true
  await refreshListCourseOverview()
}

// 确认信息框
const visibleModalConfirmStudent = ref<boolean>(false)

const confirmStudentColumns: ColumnType[] = [
  {
    title: '姓名',
    dataIndex: 'username',
    width: '7%'
  },
  {
    title: '学号',
    dataIndex: 'userNum',
    width: '10%'
  },
  {
    title: '年级',
    dataIndex: 'grade',
    width: '5%'
  },
  {
    title: '学院',
    dataIndex: 'school',
    width: '10%'
  },
  {
    title: '性别',
    dataIndex: 'gender',
    width: '3%'
  },
  {
    title: '专业',
    dataIndex: 'major',
    width: '10%'
  },
  {
    title: '班级',
    dataIndex: 'organization',
    width: '10%'
  }
]

const {
  run: runListLab,
  data: dataListLab,
  loading: loadingListLab,
  error: errorListLab
} = useRequest(apiListLabByCourseId, {
  formatResult: (res) => {
    return res.data.result
  },
  onSuccess: (res) => {
    const labIds: string[] = []
    res.records.forEach((item: { type: number; labId: any }) => {
      if (item.type === 1) {
        labIds.push(String(item.labId))
      }
    })
    transferTargetKeys.value.push(...labIds)
  }
})

// 导出成绩窗口可见
const visibleModalExportScore = ref<boolean>(false)

// 导出成绩窗口可见
const handleShowModalExportScore = async() => {
  await runListLab({ courseId: props.courseId })
  if (errorListLab.value) {
    return
  }
  visibleModalExportScore.value = true
}

// 穿梭框数据
const transferData = computed<ITransfer[]>(() => {
  return (
    dataListLab.value?.records.map((item) => {
      return {
        key: String(item.labId),
        title: item.title,
        description: String(item.type),
        disabled: false
      }
    }) ?? []
  )
})

// 穿梭框key
const transferSelectedKeys = ref<string[]>([])
const transferTargetKeys = ref<string[]>([])

// 穿梭框改变
const handleTransferChange = (
  keys: string[],
  direction: string,
  moveKeys: string[]
) => {
  transferTargetKeys.value = keys
}

// 穿梭狂选择改变
const handleTransferSelectChange = (
  sourceSelectedKeys: string[],
  targetSelectedKeys: string[]
) => {
  transferSelectedKeys.value = [...sourceSelectedKeys, ...targetSelectedKeys]
}

// 导出成绩api
const {
  run: runExportScore,
  loading: loadingExportScore,
  error: errExportScore
} = useRequest(apiExportScore, {
  onSuccess: res => {
    dataToFile(res)
  }
})
// 导出api
const handleExportScore = () => {
  runExportScore({
    courseId: props.courseId,
    labIds: transferTargetKeys.value
  })
}

</script>

<style lang="scss" scoped>
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
