<template>
  <a-spin :spinning="loadingListComment">
    <!--评论编辑框-->
    <div :class="style.clearfix">
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
          <a-form-item>
            <a-button :class="style.replyButton"
                      :loading="queriesInsertLabComment[0]?.loading"
                      type="primary" @click="handleInsertComment">
              <form-outlined/>
              新增评论
            </a-button>
          </a-form-item>
        </template>
      </a-comment>
      <!--评论条目-->
      <template v-if="dataListComment?.records.length===0">
        <a-empty :image="Empty.PRESENTED_IMAGE_SIMPLE"/>
      </template>
      <template v-else>
        <template v-for="item in dataListComment?.records"
                  :key="item.commentId">
          <comment-item :commentInfo="item"/>
        </template>
      </template>
      <a-pagination v-model:current="currentListComment"
                    :class="style.pagination"
                    :pageSize="pageSizeListComment"
                    :total="totalListComment"
                    show-less-items/>
    </div>
  </a-spin>
</template>

<script lang="ts" setup>
import { provide, reactive, Ref, ref, useCssModule, watch } from 'vue'
import CommentItem from './CommentItem.vue'
import { usePagination, useRequest } from 'vue-request'
import { apiDeleteLabComment, apiGetLabComment, apiInsertLabComment } from '../../api/web/comment'
import { insertLabCommentReq } from '../../api/web/model/commentModel'
import { Queries } from 'vue-request/dist/types/core/useAsyncQuery'
import { FormOutlined } from '@ant-design/icons-vue'
import { Empty, message } from 'ant-design-vue'
import { AxiosResponse } from 'axios'
import { Result, saveResp } from '../../api/common'

// eslint-disable-next-line no-undef
const props = defineProps<{
  labId: number
}>()

// 获取评论
const {
  run: runListComment,
  data: dataListComment,
  loading: loadingListComment,
  refresh: refreshListComment,
  pageSize: pageSizeListComment,
  current: currentListComment,
  total: totalListComment
} = usePagination(apiGetLabComment, {
  manual: false,
  defaultParams: [{
    labId: props.labId
  }],
  formatResult: (res) => {
    return res.data.result
  }
})
// labID变化时重新加载数据
watch(() => props.labId, () => {
  runListComment({ labId: props.labId })
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
  run: runInsertLabComment,
  queries: queriesInsertLabComment
} = useRequest(apiInsertLabComment, {
  queryKey: insertLabCommentReq => String(insertLabCommentReq.pid)
})

provide<Queries<AxiosResponse<Result<saveResp>>, [insertLabCommentReq: insertLabCommentReq]>>('queries', queriesInsertLabComment)
const handleReplyComment = async (pid: number, content: Ref<string>) => {
  if (content.value === '') {
    message.error('请先输入内容')
    return
  }
  await runInsertLabComment({
    labId: Number(props.labId),
    pid: pid,
    commentText: content.value
  })

  if (queriesInsertLabComment[pid]?.error) {
    return
  }
  content.value = ''
  // 重新获取评论数据
  await refreshListComment()
  isReplyCommentAreaOpenRecord[pid] = false
}
provide<(id: number, content: Ref<string>) => void>('handleReplyComment', handleReplyComment)

const {
  run: runDeleteLabComment,
  loading: loadingDeleteLabComment,
  error: errorDeleteLabComment
} = useRequest(apiDeleteLabComment)
const handleDeleteComment = async (commentId: number) => {
  await runDeleteLabComment({ commentId })
  if (errorDeleteLabComment.value) {
    return
  }
  await refreshListComment()
}
provide<(commentId: number) => void>('handleDeleteComment', handleDeleteComment)

const insertComment = ref<string>('')
const handleInsertComment = async () => {
  if (insertComment.value === '') {
    message.error('您未输入内容')
    return
  }
  await runInsertLabComment({
    labId: Number(props.labId),
    pid: 0,
    commentText: insertComment.value
  })
  // 重新获取评论数据
  if (queriesInsertLabComment[0]?.error) {
    return
  }
  insertComment.value = ''
  await refreshListComment()
}

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
