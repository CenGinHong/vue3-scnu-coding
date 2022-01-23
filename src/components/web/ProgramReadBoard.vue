<template>
  <div class="programReadBoard">
    <a-row class="row" type="flex">
      <a-col :flex="1">
        <tree class="tree" :tree-data="code" style="padding-left: 20px"></tree>
      </a-col>
      <a-divider type="vertical" />
      <a-col :flex="5" style="text-align: left">
        {{ codeContent }}
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, provide, Ref, ref, watch } from 'vue'
import Tree from './Tree.vue'
import hljsVuePlugin from '@highlightjs/vue-plugin'
import { code } from '../../api/web/model/labSubmit'

export default defineComponent({
  name: 'ProgramReadBoard',
  props: {
    code: {
      type: Array as PropType<code[]>,
      default: () => []
    }
  },
  components: {
    Tree,
    highlightjs: hljsVuePlugin.component
  },
  setup(props) {
    // 注入
    const selectedKeys: Ref<string[]> = ref<string[]>([])
    provide<Ref<string[]>>('selectedKeys', selectedKeys)
    const codeContent = ref<string>('')
    watch(
      () => selectedKeys.value,
      () => {
        const key = selectedKeys.value[selectedKeys.value.length - 1]
        const keys = key.split('-')
        let child: code[] = props.code
        let cur: code = {
          name: '',
          content: '',
          childNode: []
        }
        // 第一个0无用记得移除
        for (let i = 1; i < keys.length; i++) {
          cur = child[Number(keys[i])]
          child = cur.childNode
        }
        // 当选中为叶子节点时，修改显示的代码
        if (cur.childNode.length === 0) {
          codeContent.value = cur.content
        }
      }
    )

    return {
      codeContent
    }
  }
})
</script>

<style lang="scss" scoped>
.programReadBoard {
  height: 360px;
  overflow: scroll;
  border: 1px solid #d9d9d9;
  border-radius: 8px;

  .row {
    height: inherit;
  }

  .tree {
    width: 100px;
  }
}
</style>
