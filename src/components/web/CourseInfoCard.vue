<template>
  <a-skeleton active :loading="loading">
    <a-card>
      <template #cover>
        <a-image alt="example" src="/src/assets/gate.jpg" />
      </template>
      <template #actions class="ant-card-actions">
        <a-tag
            :color="courseInfo?.isClose ? 'default' : 'success'"
        >
          {{ courseInfo?.isClose ? '已结课' :'进行中'}}
        </a-tag>
        <slot name="action"></slot>
      </template>
      <a-card-meta :description="courseInfo?.courseDes" :title="courseInfo?.courseName">
      </a-card-meta>
    </a-card>
  </a-skeleton>
</template>

<script lang="ts" setup>

import { courseDetailResp } from '../../api/web/model/courseModel'

// eslint-disable-next-line no-undef
const props = defineProps<{
  courseInfo?:courseDetailResp
  loading:boolean
}>()

</script>

<style scoped>

</style>
