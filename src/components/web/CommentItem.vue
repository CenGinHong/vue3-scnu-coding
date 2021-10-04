<template>
  <slot name="replyActions" :item="commentInfo"></slot>
  <a-comment
    :author="commentInfo.userDetail.username"
    :datetime="commentInfo.createdAt"
  >
    <!--    <template #datetime>-->
    <!--      {{ moment(commentInfo.createdAt).fromNow() }}-->
    <!--    </template>-->
    <!--头像-->
    <template #avatar>
      <a-avatar>
        {{ commentInfo.userDetail.username }}
      </a-avatar>
    </template>
    <!--内容-->
    <template #content>
      <div :class="style.content">
        <p>{{ commentInfo.commentText }}</p>
      </div>
    </template>
    <!--动作-->
    <template #actions>
      <slot name="actions" :record="commentInfo"></slot>
    </template>
    <slot name="replyArea" :record="commentInfo"></slot>
    <template v-if="props.commentInfo.replyComments">
      <template
        v-for="item in props.commentInfo.replyComments"
        :key="item.commentId"
      >
        <comment-item :commentInfo="item">
          <template #actions="{ record }">
            <slot name="actions" :record="record"></slot>
          </template>
          <template #replyArea="{ record }">
            <slot name="replyArea" :record="record"></slot>
          </template>
        </comment-item>
      </template>
    </template>
  </a-comment>
</template>

<script lang="ts" setup>
import { useCssModule } from 'vue'
import {
  CommentOutlined,
  DeleteOutlined,
  FormOutlined
} from '@ant-design/icons-vue'
import { commentResp } from '../../api/web/model/commentModel'
import { useStore } from '../../store'

// eslint-disable-next-line no-undef
const props = defineProps<{
  commentInfo: commentResp
}>()

const store = useStore()
const userInfo = store.getters['user/userInfo']
const style = useCssModule()
</script>

<style lang="scss" module>
.content {
  color: black;
  text-align: left;
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
