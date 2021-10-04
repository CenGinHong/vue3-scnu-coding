<template>
  <a-tree
    default-expand-all
    show-line
    :tree-data="treeData"
    v-model:selectedKeys="selectedKeys"
    :fieldNames="replaceFields"
  >
    <template #switcherIcon>
      <down-outlined />
    </template>
  </a-tree>
</template>

<script lang="ts" setup>
import { inject, Ref, ref } from 'vue'
import { DownOutlined } from '@ant-design/icons-vue'
import { code } from '../../api/web/model/labSubmit'

// eslint-disable-next-line no-undef
const props = defineProps<{
  treeData: code[]
}>()

const replaceFields = {
  children: 'childNode',
  title: 'name'
}
const selectedKeys: Ref<string[]> = inject('selectedKeys') ?? ref<string[]>([])
const click = () => {
  console.log(selectedKeys)
}
</script>

<style lang="scss" scoped></style>
