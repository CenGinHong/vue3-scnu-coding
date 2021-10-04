<template>
  <div :class="style.outer">
    <a-list
      :data-source="dataSource"
      :loading="loading"
      :pagination="pag"
      :row-key="(record) => record.labId"
      item-layout="vertical"
      size="large"
    >
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
          <p>截止日期：{{ item.deadline === '' ? '无' : item.deadline }}</p>
          <slot :item="item" name="attachment"></slot>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>
<script lang="ts" setup>
import { ComputedRef, useCssModule } from 'vue'
import { labDetailResp } from '../../api/web/model/lab'
import { ExclamationCircleOutlined, LinkOutlined } from '@ant-design/icons-vue'
import { IPagination } from '../../api/common'

// eslint-disable-next-line no-undef
const props = withDefaults(
  // eslint-disable-next-line no-undef
  defineProps<{
    dataSource?: labDetailResp[]
    pag: ComputedRef<IPagination>
    loading: boolean
  }>(),
  {
    dataSource: () => []
  }
)

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
