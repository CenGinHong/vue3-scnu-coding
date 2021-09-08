<template>
  <a-spin :spinning="loadingComment">
    <div :class="style.clearfix">
      <!--评论编辑框-->
      <a-comment>
        <template #avatar>
          <a-avatar
              alt="Han Solo"
              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          />
        </template>
        <template #content>
          <a-form-item>
            <a-textarea v-model:value="insertComment"
                        :rows="4"/>
          </a-form-item>
          <a-form-item :class="style.replyButton">
            <a-button :loading="queriesInsertCourseComment[0]?.loading"
                      html-type="submit"
                      type="primary"
                      @click="handleInsertComment">
              新增评论
            </a-button>
          </a-form-item>
        </template>
      </a-comment>
      <template v-if="dataComment?.records.length===0">
        <a-empty :image="Empty.PRESENTED_IMAGE_SIMPLE"/>
      </template>
      <template v-else>

        <!--评论条目-->
        <template v-for="item in dataComment?.records"
                  :key="item.commentId">
          <comment-item :commentInfo="item"/>
        </template>
      </template>
      <a-pagination v-model:current="currentComment"
                    :class="style.pagination"
                    :pageSize="pageSizeComment"
                    :total="totalComment"
                    show-less-items/>
    </div>
  </a-spin>

</template>

<script lang="ts" setup>
import { createVNode, provide, reactive, Ref, ref, useCssModule } from 'vue'
import CommentItem from './CommentItem.vue'
import { usePagination, useRequest } from 'vue-request'
import {
  apiDeleteCourseComment,
  apiGetCourseComment,
  apiInsertCourseComment
} from '../../api/web/comment'
import { insertCourseCommentReq } from '../../api/web/model/commentModel'
import { Queries } from 'vue-request/dist/types/core/useAsyncQuery'
import { AxiosResponse } from 'axios'
import { Result, saveResp } from '../../api/common'
import { Empty, message, Modal } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'

// eslint-disable-next-line no-undef
const props = defineProps<{
  courseId: number
}>()
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
  defaultParams: [{
    courseId: props.courseId
  }],
  formatResult: (res) => {
    return res.data.result
  }
})

// 控制回复区打开
const isReplyCommentAreaOpenRecord = reactive<Record<number, boolean>>({})
// 控制修改回复区打开
const handleOpenReplyArea = (id: number) => {
  isReplyCommentAreaOpenRecord[id] = !isReplyCommentAreaOpenRecord[id] ?? true
}
provide<(id: number) => void>('handleOpenReplyArea', handleOpenReplyArea)
provide<{ [p: number]: boolean }>('isReplyCommentAreaOpenRecord', isReplyCommentAreaOpenRecord)
// 新增评论
const {
  run: runInsertCourseComment,
  queries: queriesInsertCourseComment
} = useRequest(apiInsertCourseComment, {
  queryKey: insertCourseCommentReq => String(insertCourseCommentReq.pid)
})

provide<Queries<AxiosResponse<Result<saveResp>>, [insertCourseCommentReq: insertCourseCommentReq]>>('queries', queriesInsertCourseComment)

const handleReplyComment = async (pid: number, content: Ref<string>) => {
  if (content.value === '') {
    message.error('请先输入内容')
    return
  }
  await runInsertCourseComment({
    courseId: Number(props.courseId),
    pid: pid,
    commentText: content.value
  })
  if (queriesInsertCourseComment[pid]?.error) {
    return
  }
  content.value = ''
  // 重新获取评论数据
  await refreshCourseComment()
  isReplyCommentAreaOpenRecord[pid] = false
}
provide<(id: number, content: Ref<string>) => void>('handleReplyComment', handleReplyComment)

const insertComment = ref<string>('')
const handleInsertComment = async () => {
  if (insertComment.value === '') {
    message.error('您未输入内容')
    return
  }
  await runInsertCourseComment({
    courseId: props.courseId,
    pid: 0,
    commentText: insertComment.value
  })
  // 重新获取评论数据
  if (queriesInsertCourseComment[0]?.error) {
    return
  }
  insertComment.value = ''
  await refreshCourseComment()
}

const {
  run: runDeleteCourseComment,
  loading: loadingDeleteCourseComment,
  error: errorDeleteCourseComment
} = useRequest(apiDeleteCourseComment)
const handleDeleteComment = async (commentId: number) => {
  Modal.confirm({
    title: '确认删除评论？',
    icon: createVNode(ExclamationCircleOutlined),
    content: '删除评论将会删除在该评论下的所有子评论且不可恢复，请谨慎操作！',
    okText: '确认',
    okButtonProps: { loading: loadingDeleteCourseComment.value },
    onOk: async () => {
      await runDeleteCourseComment({ commentId })
      if (errorDeleteCourseComment.value) {
        return
      }
      await refreshCourseComment()
    },
    cancelText: '取消'
  })
}
provide<(commentId: number) => void>('handleDeleteComment', handleDeleteComment)
const style = useCssModule()
</script>

<style lang="scss" module>
.clearfix {
  overflow: auto;
}

.replyButton {
  float: left
}

.pagination {
  float: right;
}
</style>
