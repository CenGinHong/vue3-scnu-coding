<template>
  <base-lab-list
      :data-source="dataLabList?.records"
      :loading="loadingListLabList"
      :pag="pagination"
  >
    <template #actions="{ item, index }">
      <!--ide编写按钮-->
      <a-button
          :class="style.ideBtu"
          type="link"
          @click="handleOpenIDE(item.labId)"
      >
        <send-outlined/>
        IDE编写实验
      </a-button>
      <!--点击按钮-->
      <a-button
          :class="style.editBtu"
          type="link"
          @click="handleRouteToReportWriteBoard(item.labId, item.deadline)"
      >
        <read-outlined v-if="isDeadLineAfter(item.deadline)"/>
        <edit-outlined v-else/>
        {{ isDeadLineAfter(item.deadline) ? '查看实验报告' : '编写实验报告' }}
      </a-button>
      <a-button
          :class="style.commentBtu"
          type="link"
          @click="handleShowComment(item.labId)"
      >
        <comment-outlined/>
        查看讨论
      </a-button>
      <a-tooltip
          :title="
          isDeadLineAfter(item.deadline)
            ? '已经超过截止时间'
            : '完成实验后自行修改'
        "
          placement="top"
      >
        <a-switch
            v-model:checked="item.labSubmitDetail.isFinish"
            :disabled="isDeadLineAfter(item.deadline)"
            :loading="queriesChangeLabFinish[item.labId]?.loading"
            checked-children="已完成"
            un-checked-children="未完成"
            @click="handleChangeFinish(index)"
        />
      </a-tooltip>
      <!--完成标志-->
      <template v-if="item.labSubmitDetail.score !== 0">
        <a-popover
            :content="item.labSubmitDetail.labSubmitComment"
            title="评语"
            trigger="hover"
        >
          成绩： <a-tag :color="scoreTagColor(item.labSubmitDetail.score)">{{
              item.labSubmitDetail.score
            }}
          </a-tag>
        </a-popover>
      </template>
    </template>
  </base-lab-list>
  <a-modal
      title="实验讨论"
      width="1000px"
      :footer="null"
      v-model:visible="visibleCommentModal">
    <lab-comment :lab-id="commentLabId"/>
  </a-modal>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, useCssModule } from 'vue'
import { usePagination, useRequest } from 'vue-request'
import { useRouter } from 'vue-router'
import {
  CommentOutlined,
  EditOutlined,
  SendOutlined,
  ReadOutlined
} from '@ant-design/icons-vue'
import LabComment from '../LabComment.vue'
import BaseLabList from '../BaseLabList.vue'
import { apiListLabByCourseId } from '../../../api/web/lab'
import { OpenIDE } from '../../../api/web/ide'
import { apiChangeLabFinish } from '../../../api/web/labSubmit'
import { fileSrc2File, scoreTagColor } from '../../../util/utils'
import { ROUTER_NAME } from '../../../router'
import { labDetailResp } from '../../../api/web/model/lab'
import { updateFinishTagReq } from '../../../api/web/model/labSubmit'
import dayjs, { Dayjs } from 'dayjs'
import { message } from 'ant-design-vue'

// eslint-disable-next-line no-undef
const props = defineProps({
  courseId: String
})

const router = useRouter()
// 获取实验内容
const {
  data: dataLabList,
  loading: loadingListLabList,
  total,
  current,
  pageSize
} = usePagination(apiListLabByCourseId, {
  manual: false,
  formatResult: (res) => {
    res.data.result!.records.forEach((item: labDetailResp) => {
      item.fileList = []
      if (item.attachmentSrc !== '') {
        item.fileList.push(fileSrc2File(item.attachmentSrc))
      }
    })
    return res.data.result
  },
  defaultParams: [
    {
      courseId: Number(props.courseId)
    }
  ]
})

// 分页数据
const pagination = computed(() => ({
  onChange: (page: number) => {
    current.value = page
  },
  total: total.value,
  pageSize: pageSize.value
}))

// 是否过截止日期
const isDeadLineAfter = (deadline: Dayjs): boolean => {
  return dayjs().isAfter(deadline)
}

// 修改完成标志
const { run: runChangeLabFinish, queries: queriesChangeLabFinish } = useRequest(
  apiChangeLabFinish,
  {
    queryKey: (updateFinishTagReq) => String(updateFinishTagReq.labId)
  }
)

const handleChangeFinish = (index: number) => {
  runChangeLabFinish({
    isFinish:
        dataLabList.value!.records[index].labSubmitDetail?.isFinish ?? true,
    labId: dataLabList.value!.records[index].labId
  })
}

const handleRouteToReportWriteBoard = (labId: number, deadline: Dayjs) => {
  if (!isDeadLineAfter(deadline)) {
    router.push({
      name: ROUTER_NAME.REPORT_WRITE_BOARD,
      query: {
        labId: labId
      }
    })
  } else {
    router.push({
      name: ROUTER_NAME.REPORT_READ_BOARD,
      query: {
        labId: labId
      }
    })
  }
}

const {
  run: runOpenIDE,
  data: dataOpenIDE,
  error: errorOpenIDE
} = useRequest(OpenIDE, {
  formatResult: (res :any) => {
    return res.data.result
  }
})

const handleOpenIDE = async(labId: number) => {
  const hide = message.loading('启动IDE中..', 0)
  await runOpenIDE({
    labId
  })
  if (errorOpenIDE.value) {
    hide()
    return
  }
  // 等5秒再开启
  setTimeout(() => {
    hide()
    window.open(dataOpenIDE.value!.url)
  }, 1000)
}

// 打开某实验的讨论区
const handleShowComment = (labId: number) => {
  // 打开该讨论框
  visibleCommentModal.value = true
  // 获取讨论
  commentLabId.value = labId
}

const visibleCommentModal = ref<boolean>(false)
const commentLabId = ref<number>(0)

const fileList: any[] = []
const style = useCssModule()
</script>

<style lang="scss" module>
.ideBtu {
  margin-left: -15px;
}

.editBtu {
  color: gray;
}

.commentBtu {
  color: gray;
}
</style>
