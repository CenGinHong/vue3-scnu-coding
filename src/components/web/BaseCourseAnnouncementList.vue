<template>
  <div :class="style.outer">
    <a-list
        :data-source="dataCourse"
        :loading="loading"
        :pagination="pag"
        :row-key="record => record.courseAnnouncementId"
        item-layout="vertical"
        size="large">
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
          <p>更新日期：{{ moment(item.updatedAt).format('YYYY-MM-DD') }}</p>
          <a v-if="item.attachmentFileDetail" :href="item.attachmentFileDetail.url">
            <linkedin-outlined/>
            {{ item.attachmentFileDetail.filename }}</a>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script lang="ts" setup>
import { ComputedRef, useCssModule } from 'vue'
import { pagination } from '../../api/common'
import { courseAnnouncementListResp } from '../../api/web/model/courseAnnouncement'
import moment from 'moment'
import { LinkedinOutlined } from '@ant-design/icons-vue'

// eslint-disable-next-line no-undef
const props = withDefaults(defineProps<{
  dataCourse?: courseAnnouncementListResp[],
  pag: ComputedRef<pagination>
  loading: boolean
}>(), {
  dataCourse: () => []
})

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
