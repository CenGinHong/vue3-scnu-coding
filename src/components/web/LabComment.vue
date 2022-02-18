<template>
  <a-skeleton avatar active :loading="loadingListComment">
    <!--讨论编辑框-->
    <a-comment>
      <template #avatar>
        <a-avatar>{{ userInfo.username }}</a-avatar>
      </template>
      <template #content>
        <a-form-item>
          <a-textarea v-model:value="replyCommentRecord[0]" :rows="4"/>
        </a-form-item>
        <a-form-item>
          <div class="replyButton">
            <a-button
                :loading="queriesInsertLabComment[0]?.loading"
                type="primary"
                @click="handleReplyComment(0)"
            >
              <form-outlined/>
              新增讨论
            </a-button>
          </div>

        </a-form-item>
      </template>
    </a-comment>
    <!--讨论条目-->
    <template v-if="dataListComment?.records.length === 0">
      <a-empty :image="Empty.PRESENTED_IMAGE_SIMPLE"/>
    </template>
    <template v-else>
      <template v-for="item in dataListComment?.records" :key="item.commentId">
        <comment-item :commentInfo="item">
          <template #actions="{ record }">
            <span @click="handleChangeOpenCommentArea(record.commentId)">
              <comment-outlined/>
              {{ openCommentArea[record.commentId] ? '取消回复' : '回复' }}
            </span>
            <template v-if="userInfo.userId === record.userDetail.userId">
              <a-popconfirm
                  title='将同时删除在该讨论下的所有子讨论！'
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm="handleDeleteComment(record.commentId)"
              >
                <span class="delBtn">
                <delete-outlined/>删除
              </span>
              </a-popconfirm>
            </template>
            <!--回复框-->
          </template>
          <template #replyArea="{ record }">
            <template v-if="openCommentArea[record.commentId]">
              <a-comment>
                <template #content>
                  <a-form-item>
                    <a-textarea
                        v-model:value="replyCommentRecord[record.commentId]"
                        :rows="4"
                    />
                  </a-form-item>
                  <a-form-item>
                    <a-button
                        :loading="
                        queriesInsertLabComment[record.commentId]?.loading
                      "
                        type="primary"
                        @click="handleReplyComment(record.commentId)"
                        :disabled="
                        replyCommentRecord[record.commentId] === undefined ||
                        replyCommentRecord[record.commentId] === ''
                      "
                    >
                      <form-outlined/>
                      回复
                    </a-button>
                  </a-form-item>
                </template>
              </a-comment>
            </template>
          </template>
        </comment-item>
      </template>
      <div class="pagination">
        <a-pagination
            v-model:current="currentListComment"
            :pageSize="pageSizeListComment"
            :total="totalListComment"
            show-less-items
        />
      </div>
    </template>
  </a-skeleton>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import CommentItem from './CommentItem.vue'
import { usePagination, useRequest } from 'vue-request'
import {
  apiDeleteLabComment,
  apiGetLabComment,
  apiInsertLabComment
} from '../../api/web/comment'
import {
  CommentOutlined,
  DeleteOutlined,
  FormOutlined
} from '@ant-design/icons-vue'
import { Empty, message, Modal } from 'ant-design-vue'
import { useStore } from '../../store'
import { IUserInfo } from '../../store/modules/user/state'

// eslint-disable-next-line no-undef
const props = defineProps<{
  labId: number
}>()

const store = useStore()

const userInfo = computed<IUserInfo>(() => store.getters['user/userInfo'])

// 获取讨论
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
  defaultParams: [
    {
      labId: props.labId
    }
  ],
  formatResult: (res) => {
    return res.data.result
  }
})

// labID变化时重新加载数据
watch(
  () => props.labId,
  () => {
    runListComment({ labId: props.labId })
  }
)

const openCommentArea = ref<Record<number, boolean>>({})
const handleChangeOpenCommentArea = (id: number) => {
  openCommentArea.value[id] = !openCommentArea.value[id] ?? true
}

// 新增讨论
const { run: runInsertLabComment, queries: queriesInsertLabComment } =
    useRequest(apiInsertLabComment, {
      queryKey: (insertLabCommentReq) => String(insertLabCommentReq.pid)
    })

const replyCommentRecord = ref<Record<number, string>>({})
const handleReplyComment = async(pid: number) => {
  const content = replyCommentRecord.value[pid]
  if (replyCommentRecord.value[pid] === undefined || replyCommentRecord.value[pid] === '') {
    message.error('讨论内容不能为空')
    return
  }
  if (content === undefined || content === '') {
    message.error('请先输入内容')
    return
  }
  await runInsertLabComment({
    labId: Number(props.labId),
    pid: pid,
    commentText: content
  })

  if (queriesInsertLabComment[pid]?.error) {
    return
  }
  // 清空讨论框
  replyCommentRecord.value[pid] = ''
  // 重新获取讨论数据
  openCommentArea.value[pid] = false
  await refreshListComment()
}

const {
  run: runDeleteLabComment,
  error: errorDeleteLabComment
} = useRequest(apiDeleteLabComment)
const handleDeleteComment = async(labCommentId: number) => {
  await runDeleteLabComment({ labCommentId })
  if (errorDeleteLabComment.value) {
    return
  }
  await refreshListComment()
}

</script>

<style lang="scss" scoped>
.replyButton {
  display: flex;
}

.delBtn {
  color: #ff7875 !important;
}

.pagination {
  display: flex;
  flex-direction: row-reverse;
}
</style>
