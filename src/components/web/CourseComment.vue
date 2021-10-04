<template>
  <a-spin :spinning="loadingComment">
    <!--评论编辑框-->
    <a-comment>
      <template #avatar>
        <a-avatar>
          {{ userInfo.username }}
        </a-avatar>
      </template>
      <template #content>
        <a-form-item>
          <a-textarea v-model:value="replyCommentRecord[0]" :rows="4" />
        </a-form-item>
        <a-form-item :class="style.replyButton">
          <a-button
            :loading="queriesInsertCourseComment[0]?.loading"
            html-type="submit"
            type="primary"
            @click="handleReplyComment(0)"
            :disabled="
              replyCommentRecord[0] === undefined ||
              replyCommentRecord[0] === ''
            "
          >
            <form-outlined />
            新增评论
          </a-button>
        </a-form-item>
      </template>
    </a-comment>
    <template v-if="dataComment?.records.length === 0">
      <a-empty :image="Empty.PRESENTED_IMAGE_SIMPLE" />
    </template>
    <template v-else>
      <!--评论条目-->
      <template v-for="item in dataComment?.records" :key="item.commentId">
        <comment-item :commentInfo="item">
          <template #actions="{ record }">
            <span @click="handleChangeOpenCommentArea(record.commentId)">
              <comment-outlined />
              {{
                openCommentArea[record.commentId] ? '取消回复' : '回复'
              }}</span
            >
            <template v-if="userInfo.userId === record.userDetail.userId">
              <span
                :class="style.delBtn"
                @click="handleDeleteComment(record.commentId)"
              >
                <delete-outlined />
                删除
              </span>
            </template>
            <!--回复框-->
          </template>
          <template #replyArea="{ record }">
            <template v-if="openCommentArea[record.commentId]">
              <!--<div  style="text-align: left">-->
              <a-comment>
                <template #content>
                  <a-form-item>
                    <a-textarea
                      v-model:value="replyCommentRecord[record.commentId]"
                      :rows="4"
                    />
                  </a-form-item>
                  <a-form-item :class="style.replyButton">
                    <a-button
                      :loading="
                        queriesInsertCourseComment[record.commentId]?.loading
                      "
                      type="primary"
                      @click="handleReplyComment(record.commentId)"
                      :disabled="
                        replyCommentRecord[record.commentId] === undefined ||
                        replyCommentRecord[record.commentId] === ''
                      "
                    >
                      <form-outlined />
                      回复
                    </a-button>
                  </a-form-item>
                </template>
              </a-comment>
              <!--</div>-->
            </template>
          </template>
        </comment-item>
      </template>
    </template>
    <a-pagination
      v-if="dataComment?.records.length !== 0"
      v-model:current="currentComment"
      :class="style.pagination"
      :pageSize="pageSizeComment"
      :total="totalComment"
      show-less-items
    />
  </a-spin>
</template>

<script lang="ts" setup>
import { computed, createVNode, ref, useCssModule } from 'vue'
import CommentItem from './CommentItem.vue'
import { usePagination, useRequest } from 'vue-request'
import {
  CommentOutlined,
  DeleteOutlined,
  FormOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue'
import {
  apiDeleteCourseComment,
  apiGetCourseComment,
  apiInsertCourseComment
} from '../../api/web/comment'
import { Empty, message, Modal } from 'ant-design-vue'

import { useStore } from '../../store'
import { IUserInfo } from '../../store/modules/user/state'

// eslint-disable-next-line no-undef
const props = defineProps<{
  courseId: number
}>()

const store = useStore()

const userInfo = computed<IUserInfo>(() => store.getters['user/userInfo'])
// 评论相关
const {
  data: dataComment,
  loading: loadingComment,
  refresh: refreshCourseComment,
  pageSize: pageSizeComment,
  current: currentComment,
  total: totalComment
} = usePagination(apiGetCourseComment, {
  manual: false,
  defaultParams: [
    {
      courseId: props.courseId
    }
  ],
  formatResult: (res) => {
    return res.data.result
  }
})

const openCommentArea = ref<Record<number, boolean>>({})
const handleChangeOpenCommentArea = (id: number) => {
  openCommentArea.value[id] = !openCommentArea.value[id] ?? true
}

const { run: runInsertCourseComment, queries: queriesInsertCourseComment } =
  useRequest(apiInsertCourseComment, {
    queryKey: (insertCourseCommentReq) => String(insertCourseCommentReq.pid)
  })

const replyCommentRecord = ref<Record<number, string>>({})
const handleReplyComment = async(pid: number) => {
  const content = replyCommentRecord.value[pid]
  await runInsertCourseComment({
    courseId: Number(props.courseId),
    pid: pid,
    commentText: content
  })
  if (queriesInsertCourseComment[pid]?.error) {
    return
  }
  // 清空评论框
  replyCommentRecord.value[pid] = ''
  // 重新获取评论数据
  openCommentArea.value[pid] = false
  await refreshCourseComment()
}

const {
  run: runDeleteCourseComment,
  loading: loadingDeleteCourseComment,
  error: errorDeleteCourseComment
} = useRequest(apiDeleteCourseComment)
const handleDeleteComment = async(courseCommentId: number) => {
  Modal.confirm({
    title: '确认删除评论？',
    icon: createVNode(ExclamationCircleOutlined),
    content: '删除评论将会删除在该评论下的所有子评论且不可恢复，请谨慎操作！',
    okText: '确认',
    okButtonProps: { loading: loadingDeleteCourseComment.value, danger: true },
    onOk: async() => {
      await runDeleteCourseComment({ courseCommentId })
      if (errorDeleteCourseComment.value) {
        return
      }
      await refreshCourseComment()
    },
    cancelText: '取消'
  })
}

const style = useCssModule()
</script>

<style lang="scss" module>
.clearfix {
  overflow: auto;
}

.replyButton {
  float: left;
}

.delBtn {
  color: #ff7875 !important;
}

.pagination {
  float: right;
}
</style>
