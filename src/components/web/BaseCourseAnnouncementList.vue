<template>
  <div :class="style.outer">
    <a-list
      :data-source="dataCourse"
      :loading="loading"
      :pagination="pag"
      :row-key="(record) => record.courseAnnouncementId"
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
              <div :class="style.announcementTitle">
                <p>{{ item.title }}</p>
              </div>
            </template>
          </a-list-item-meta>
          <p :class="style.announcementContent">{{ item.content }}</p>
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

// eslint-disable-next-line no-undef
const props = withDefaults(
  // eslint-disable-next-line no-undef
  defineProps<{
    dataCourse?: courseAnnouncementDetailResp[]
    pag: IPagination
    loading: boolean
  }>(),
  {
    dataCourse: () => []
  }
)

const style = useCssModule()
</script>

<style lang="scss" module>
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
