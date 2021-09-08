<template>
  <a-tree default-expand-all
          show-line
          :tree-data="treeData"
          v-model:selectedKeys="selectedKeys" :replaceFields="replaceFields">
    <template #switcherIcon>
      <down-outlined/>
    </template>
  </a-tree>
</template>

<script lang="ts">
import { defineComponent, inject, PropType, Ref, ref } from 'vue'
import { DownOutlined } from '@ant-design/icons-vue'
import { code } from '../api/web/model/labSubmit'

export default defineComponent({
  name: 'Tree',
  components: {
    DownOutlined
  },
  props: {
    treeData: {
      type: Array as PropType<code[]>
    }
  },
  setup () {
    const replaceFields = {
      children: 'childNode',
      title: 'name'
    }
    const selectedKeys: Ref<string[]> = inject('selectedKeys') ?? ref<string[]>([])
    const click = () => {
      console.log(selectedKeys)
    }
    return {
      selectedKeys,
      replaceFields,
      click
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
