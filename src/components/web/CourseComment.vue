<template>
  <a-skeleton avatar active :loading="loadingComment">
    <!--讨论编辑框-->
    <a-comment>
      <template #avatar>
        <a-avatar>
          {{ userInfo.username }}
        </a-avatar>
      </template>
      <template #content>
        <a-form-item>
          <a-textarea v-model:value="replyCommentRecord[0]" :rows="4"/>
        </a-form-item>
        <a-form-item>
          <div class="replyButton">
            <a-button
                :loading="queriesInsertCourseComment[0]?.loading"
                html-type="submit"
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
    <template v-if="dataComment?.records.length === 0">
      <a-empty :image="Empty.PRESENTED_IMAGE_SIMPLE"/>
    </template>
    <template v-else>
      <!--讨论条目-->
      <template v-for="item in dataComment?.records" :key="item.commentId">
        <comment-item :commentInfo="item">
          <template #actions="{ record }">
            <span @click="handleChangeOpenCommentArea(record.commentId)">
              <comment-outlined/>
              {{
                openCommentArea[record.commentId] ? '取消回复' : '回复'
              }}</span
            >
            <template v-if="isAbleDelete(record.userDetail.userId)">
              <a-popconfirm
                  title='将同时删除在该讨论下的所有子讨论！'
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm="handleDeleteComment(record.commentId)"
              >
                <span
                    class="delBtn"
                >
                <delete-outlined/>
                删除
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
                    <div class="replyButton">
                      <a-button
                          :loading="
                        queriesInsertCourseComment[record.commentId]?.loading
                      "
                          type="primary"
                          @click="handleReplyComment(record.commentId)"
                      >
                        <form-outlined/>
                        回复
                      </a-button>
                    </div>
                  </a-form-item>
                </template>
              </a-comment>
            </template>
          </template>
        </comment-item>
      </template>
    </template>
    <div class="pagination">
      <a-pagination
          v-if="dataComment?.records.length !== 0"
          v-model:current="currentComment"
          :pageSize="pageSizeComment"
          :total="totalComment"
          show-less-items
      />
    </div>
  </a-skeleton>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
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
  apiListCourseComment,
  apiInsertCourseComment
} from '../../api/web/comment'
import { Empty, message } from 'ant-design-vue'

import { useStore } from '../../store'
import { IUserInfo } from '../../store/modules/user/state'
import { RoleEnum } from '../../enums/roleEnum'

// eslint-disable-next-line no-undef
const props = defineProps<{
  courseId: number
}>()

const store = useStore()

const userInfo = computed<IUserInfo>(() => store.getters['user/userInfo'])
// 讨论相关
const {
  data: dataComment,
  loading: loadingComment,
  refresh: refreshCourseComment,
  pageSize: pageSizeComment,
  current: currentComment,
  total: totalComment
} = usePagination(apiListCourseComment, {
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

const {
  run: runInsertCourseComment,
  queries: queriesInsertCourseComment
} = useRequest(apiInsertCourseComment, {
  queryKey: (insertCourseCommentReq) => String(insertCourseCommentReq.pid)
})

const replyCommentRecord = ref<Record<number, string>>({})
const handleReplyComment = async(pid: number) => {
  const content = replyCommentRecord.value[pid]
  if (content === undefined || content === '') {
    message.error('讨论内容不能为空')
    return
  }
  await runInsertCourseComment({
    courseId: Number(props.courseId),
    pid: pid,
    commentText: content
  })

  if (queriesInsertCourseComment[pid]?.error) {
    return
  }
  // 清空讨论框
  replyCommentRecord.value[pid] = ''
  // 重新获取讨论数据
  openCommentArea.value[pid] = false
  await refreshCourseComment()
}

const isAbleDelete = (userId: number) => {
  return userInfo.value.userId === userId || userInfo.value.roleId === RoleEnum.ADMIN
}

const {
  run: runDeleteCourseComment,
  error: errorDeleteCourseComment
} = useRequest(apiDeleteCourseComment)
const handleDeleteComment = async(courseCommentId: number) => {
  await runDeleteCourseComment({ courseCommentId })
  if (errorDeleteCourseComment.value) {
    return
  }
  await refreshCourseComment()
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
