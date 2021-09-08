<template>
  <a-comment :author="commentInfo.userDetail.username">
    <template #datetime>
      {{ moment(commentInfo.createdAt).fromNow() }}
    </template>
    <!--头像-->
    <template #avatar>
      <a-avatar
          :alt="commentInfo.userDetail.username"
          :src="commentInfo.userDetail.avatarUrl"/>
    </template>
    <!--内容-->
    <template #content>
      <div :class="style.content">
        <p>{{ commentInfo.commentText }}</p>
      </div>
    </template>
    <!--动作-->
    <template #actions>
      <span @click="handleOpenReplyArea(commentInfo.commentId)">
        <comment-outlined/>  {{
          isReplyCommentAreaOpenRecord[commentInfo.commentId] ? '取消回复' : '回复'
        }}</span>
      <template v-if="userInfo.userId===commentInfo.userDetail.userId">
        <span :class="style.delBtn" @click="handleDeleteComment(commentInfo.commentId)">
         <delete-outlined/>
          删除
        </span>
      </template>
    </template>
    <!--回复框-->
    <template v-if="isReplyCommentAreaOpenRecord[commentInfo.commentId]">
      <div style="text-align: left">
        <a-comment>
          <template #content>
            <a-form-item>
              <a-textarea v-model:value="replyCommentContent" :rows="4"/>
            </a-form-item>
            <a-form-item>
              <a-button :loading="queriesInsertLabComment[commentInfo.commentId]?.loading" type="primary"
                        @click="handleReplyComment(commentInfo.commentId)">
                <form-outlined/>
                回复
              </a-button>
            </a-form-item>
          </template>
        </a-comment>
      </div>
    </template>
    <template v-if="commentInfo.replyComments">
      <template v-for="item in commentInfo.replyComments" :key="item.commentId">
        <comment-item :commentInfo="item"/>
      </template>
    </template>
  </a-comment>
</template>

<script lang="ts">
import {defineComponent, inject, PropType, Ref, ref, useCssModule} from 'vue'
import { CommentOutlined, DeleteOutlined, FormOutlined } from '@ant-design/icons-vue'
import { commentResp, insertLabCommentReq } from '../../api/web/model/commentModel'
import { useStore } from '../../store'
import moment from 'moment'
import { Queries } from 'vue-request/dist/types/core/useAsyncQuery'
import { AxiosResponse } from 'axios'
import { Result, saveResp } from '../../api/common'

export default defineComponent({
  name: 'CommentItem',
  props: {
    commentInfo: {
      type: Object as PropType<commentResp>,
      default: () => {
      }
    }
  },
  components: {
    FormOutlined,
    CommentOutlined,
    DeleteOutlined
  },
  setup () {
    const store = useStore()
    const userInfo = store.getters['user/userInfo']
    // 控制打开区域
    const isReplyCommentAreaOpenRecord = inject<{ [p: number]: boolean }>('isReplyCommentAreaOpenRecord')
    const handleOpenReplyArea = inject<(id: number) => void>('handleOpenReplyArea')
    // 控制回复评论
    const replyComment = inject<(id: number, content: Ref<string>) => void>('handleReplyComment')!
    const replyCommentContent = ref<string>('')
    const handleReplyComment = (commentId: number) => {
      replyComment(commentId, replyCommentContent)
    }
    const queriesInsertLabComment = inject<Queries<AxiosResponse<Result<saveResp>>,
        [insertLabComment: insertLabCommentReq]>>('queries')

    const deleteComment = inject<(commentId: number) => void>('handleDeleteComment')!
    const handleDeleteComment = (commentId: number) => {
      deleteComment(commentId)
    }
    const style = useCssModule()
    return {
      style,
      handleDeleteComment,
      userInfo,
      isReplyCommentAreaOpenRecord,
      handleOpenReplyArea,
      replyCommentContent,
      queriesInsertLabComment,
      handleReplyComment,
      moment
    }
  }
})
</script>

<style lang="scss" module>

.content {
  color: black;
  text-align: left;
}

.delBtn {
  color: #ff4d4f;
}

</style>

<style lang="scss" scoped>

::v-deep(.ant-comment-actions) {
  display: flex;
}

::v-deep(.github-markdown-body) {
  padding: 0 0 0 0;
}

::v-deep(.ant-spin-container) {
  display: flex;
  justify-content: flex-end;
}

</style>
