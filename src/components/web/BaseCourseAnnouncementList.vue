<template>
  <div class="outer">
    <a-list
      :data-source="dataCourse"
      :loading="loading"
      :pagination="pag"
      item-layout="vertical"
      size="large"
    >
      <template #renderItem="{ item, index }">
        <a-list-item>
          <template #actions>
            <slot :index="index" :item="item" name="actions"></slot>
          </template>
          <a-list-item-meta :title="item.title">
            <template #title>
              <div class="announcementTitle">
                <p>{{ item.title }}</p>
              </div>
            </template>
          </a-list-item-meta>
          <p class="announcementContent">{{ item.content }}</p>
          <p>更新日期：{{ dayjs(item.updatedAt).format('YYYY-MM-DD') }}</p>
          <a-upload :file-list="item.fileList" :showUploadList = "{ showRemoveIcon: false }" />
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script lang="ts" setup>
import { useCssModule } from 'vue'
import { IPagination } from '../../api/common'
import { courseAnnouncementDetailResp } from '../../api/web/model/courseAnnouncement'
import { LinkedinOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { TablePaginationConfig } from 'ant-design-vue/es/table/Table'

// eslint-disable-next-line no-undef
const props = withDefaults(
  // eslint-disable-next-line no-undef
  defineProps<{
    dataCourse?: courseAnnouncementDetailResp[]
    pag: TablePaginationConfig
    loading: boolean
  }>(),
  {
    dataCourse: () => []
  }
)

</script>

<style lang="scss" scoped>
.outer {
  text-align: left;

  .announcementTitle {
    font-size: 18px;
  }

  .announcementContent {
    width: 800px;
  }
}
</style>
