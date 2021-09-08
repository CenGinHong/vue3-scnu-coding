<template>
  <base-lab-list :data-source="dataLabList?.records" :loading="loadingListLabList" :pag="pagination">
    <template #actions="{ item, index}">
      <!--ide编写按钮-->
      <a-button :class="style.ideBtu" type="link"
                @click="handleOpenIDE(item.labId)">
        <send-outlined/>
        IDE编写实验
      </a-button>
      <!--点击按钮-->
      <a-button
          :class="style.editBtu"
          type="link"
          @click="handleRouteToReportWriteBoard(item.labId,item.deadline)">
        <edit-outlined/>
        {{ isDeadLineAfter(item.deadline) ? '查看实验报告' : '编写实验报告' }}
      </a-button>
      <a-button
          :class="style.commentBtu"
          type="link"
          @click="handleShowComment(item.labId)">
        <comment-outlined/>
        查看评论
      </a-button>
      <a-tooltip placement="top" title="完成实验后自行修改">
        <a-switch
            v-model:checked="item.labSubmitDetail.isFinish"
            :disabled="isDeadLineAfter(item.deadline)"
            checked-children="已完成"
            un-checked-children="未完成"
            @click="handleChangeFinish(index)"/>
      </a-tooltip>
      <!--完成标志-->
      <template v-if="item.labSubmitDetail.score!==0">
        <a-popover :content="item.labSubmitDetail.labSubmitComment" title="评语" trigger="hover">
          <a-tag :color="scoreTagColor(item.labSubmitDetail.score)">{{ item.labSubmitDetail.score }}</a-tag>
        </a-popover>
      </template>
    </template>
  </base-lab-list>
  <a-modal v-model:visible="visibleCommentModal" title="实验评论" width="1000px" :footer="null">
      <lab-comment :lab-id="commentLabId"/>
  </a-modal>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, useCssModule, watch } from 'vue'
import { usePagination, useRequest } from 'vue-request'
import { useRouter } from 'vue-router'
import moment, { Moment } from 'moment'
import { CommentOutlined, EditOutlined, SendOutlined } from '@ant-design/icons-vue'
import LabComment from '../LabComment.vue'
import BaseLabList from '../BaseLabList.vue'
import { apiListLabByCourseId } from '../../../api/web/lab'
import { OpenIDE } from '../../../api/web/ide'
import { apiChangeLabFinish } from '../../../api/web/labSubmit'
import { scoreTagColor } from '../../../util/utils'
import { ROUTER_NAME } from '../../../router'

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
    return res.data.result
  },
  defaultParams: [{
    courseId: props.courseId
  }]
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
const isDeadLineAfter = (deadline: Moment): boolean => {
  return moment().isAfter(deadline)
}

// 修改完成标志
const {
  run: runChangeLabFinish
} = useRequest(apiChangeLabFinish)

const handleChangeFinish = (index: number) => {
  runChangeLabFinish({
    isFinish: dataLabList.value!.records[index].labSubmitDetail?.isFinish,
    labId: dataLabList.value!.records[index].labId
  })
}

const handleRouteToReportWriteBoard = (labId: number, deadline: Moment) => {
  router.push({
    name: ROUTER_NAME.REPORT_WRITE_BOARD,
    query: {
      labId: labId
    }
  })
}

const {
  run: runOpenIDE,
  data: dataOpenIDE,
  error: errorOpenIDE
} = useRequest(OpenIDE, {
  formatResult: (res) => {
    return res.data.result
  }
})

const handleOpenIDE = (labId: number) => {
  runOpenIDE({
    labId
  })
  if (errorOpenIDE) {
    return
  }
  window.open(dataOpenIDE.value!.url)
}

// 空值评论区开闭
const isShowComment = reactive<Record<number, boolean>>({})
// 打开某实验的评论区
const handleShowComment = (labId: number) => {
  // 打开该评论框
  visibleCommentModal.value = true
  // 获取评论
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
