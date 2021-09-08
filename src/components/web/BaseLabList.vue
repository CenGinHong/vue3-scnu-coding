<template>
  <div :class="style.outer">
    <a-list
        :data-source="props.dataSource"
        :loading="props.loading"
        :pagination="props.pag"
        :row-key="record => record.labId"
        item-layout="vertical"
        size="large">
      <template #renderItem="{ item, index }">
        <a-list-item>
          <template #actions>
            <slot :index="index" :item="item" name="actions"></slot>
          </template>
          <a-list-item-meta :description="item.description">
            <template #title>
              <div :class="style.labTitle">
                <p>{{ item.title }}</p>
              </div>
            </template>
          </a-list-item-meta>
          <p>{{ item.content }}</p>
          <p>截止日期：{{ item.deadline === '' ? '无' : item.deadline  }}</p>
          <a v-if="item.attachmentFileDetail" :href="item.attachmentFileDetail.url">
            <link-outlined/>
            {{ item.attachmentFileDetail.filename }}</a>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>
<script lang="ts" setup>
import { ComputedRef, useCssModule } from 'vue'
import { pagination } from '../../api/common'
import { labDetailResp } from '../../api/web/model/lab'
import { LinkOutlined } from '@ant-design/icons-vue'

// eslint-disable-next-line no-undef
const props = withDefaults(defineProps<{
  dataSource?: labDetailResp[]
  pag: ComputedRef<pagination>
  loading: boolean
}>(), {
  dataSource: () => []
})

const style = useCssModule()
</script>

<style lang="scss" module>
.outer {
  text-align: left;

  .labTitle {
    font-size: 18px;
  }

}
</style>
