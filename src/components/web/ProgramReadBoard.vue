<template>
  <a-skeleton active :loading="loadingGetLabCode">
    <a-empty v-if="codeData?.length === 0" :image="Empty.PRESENTED_IMAGE_SIMPLE"/>
    <template v-else>
      <a-button class="actionButton" type="primary"
      >
        IDE打开
      </a-button>
      <div class="programReadBoard">
        <a-row class="row" type="flex">
          <a-col :span="5">
            <a-directory-tree
                v-model:expandedKeys="expandedKeys"
                v-model:selectedKeys="selectedKeys"
                :blockNode="false"
                :field-names="fieldNames"
                :tree-data="codeData"
            />
          </a-col>
          <a-divider type="vertical"/>
          <a-col :span="18" style="text-align: left; white-space: pre-wrap;">
            <a-empty v-if="codeContent ===''" :image="Empty.PRESENTED_IMAGE_SIMPLE"/>
            <highlightjs v-else autodetect :code="codeContent"/>
          </a-col>
        </a-row>
      </div>
    </template>
  </a-skeleton>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { code } from '../../api/web/model/labSubmit'
import hljs from 'highlight.js/lib/common'
import hljsVuePlugin from '@highlightjs/vue-plugin'
import { Empty } from 'ant-design-vue'
import { useRequest } from 'vue-request'
import { apiGetLabCode } from '../../api/web/labSubmit'

// eslint-disable-next-line no-undef
const props = withDefaults(defineProps<{
  labId?: number,
  userId?: number
}>(), {
  userId: 0,
  labId: 0
})

const codeData = ref<code[]>([])

const { run: runGetLabCode, loading: loadingGetLabCode } = useRequest(
  apiGetLabCode,
  {
    formatResult: (res) => {
      return res.data.result
    },
    onSuccess: (res) => {
      codeData.value = res
    }
  }
)

watch(() => props, (newValue) => {
  if (newValue.labId === 0 || newValue.userId === 0) {
    return
  }
  runGetLabCode({
    labId: newValue.labId,
    userId: Number(newValue.userId)
  })
})

const expandedKeys = ref<[]>([])

const fieldNames = {
  children: 'childNode',
  title: 'name'
}

// 选中的tree key
const selectedKeys = ref<string[]>([])

// 内容
const codeContent = ref<string>('')

watch(() => selectedKeys.value, (newValue) => {
  if (newValue.length === 0) {
    return
  }
  const keys = newValue[0].split('-').slice(1, newValue[0].length)
  if (keys.length === 0) {
    return
  }
  let cur = codeData.value[Number(keys[0])]
  for (let i = 1; i < keys.length; i++) {
    cur = cur.childNode[Number(keys[i])]
  }
  // 这里不会查出空文件夹，需要使用的该文本来实现
  if (cur.childNode.length === 0) {
    codeContent.value = cur.content
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
