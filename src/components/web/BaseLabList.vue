<template>
    <a-list
      :data-source="dataSource"
      :loading="loading"
      :pagination="pag"
      :row-key="(record) => record.labId"
      item-layout="vertical"
      size="large"
      class="list"
    >
      <template #renderItem="{ item, index }">
        <a-list-item>
          <template #actions>
            <slot :index="index" :item="item" name="actions"></slot>
          </template>
          <a-list-item-meta :description="item.description">
            <template #title>
                <p>{{ item.title }}</p>
            </template>
          </a-list-item-meta>
          <p>{{ item.content }}</p>
          <p>截止日期：{{ item.deadline === '' ? '无' : item.deadline }}</p>
          <slot :item="item" name="attachment"></slot>
        </a-list-item>
      </template>
    </a-list>
</template>
<script lang="ts" setup>
import { labDetailResp } from '../../api/web/model/lab'
import { ExclamationCircleOutlined, LinkOutlined } from '@ant-design/icons-vue'
import { TablePaginationConfig } from 'ant-design-vue'

// eslint-disable-next-line no-undef
const props = withDefaults(
  // eslint-disable-next-line no-undef
  defineProps<{
    dataSource?: labDetailResp[]
    pag: TablePaginationConfig|null
    loading: boolean
  }>(),
  {
    dataSource: () => []
  }
)

</script>

<style lang="scss" scoped>

.list {
  text-align: start;
}
</style>
