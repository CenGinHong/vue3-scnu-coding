<template>
  <a-row class="row">
    <a-col class="col" :span="20" :offset="2">
      <v-md-editor :model-value="reportContent" height="500px" mode="preview"/>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useRequest } from 'vue-request'
import {
  apiGetReportContent
} from '../../api/web/labSubmit'
// eslint-disable-next-line no-undef
const props = defineProps<{
  labId: number
}>()

const route = useRoute()

const reportContent = ref<string>('')
// 获取之前撰写的实验报告的内容
useRequest(apiGetReportContent, {
  manual: false,
  defaultParams: [
    {
      labId: props.labId
    }
  ],
  formatResult: (res) => {
    return res.data.result
  },
  onSuccess: (res) => {
    reportContent.value = res.reportContent
  }
})

</script>
<style lang="scss" scoped>
.row {
  margin-top: 20px;

  .col {
    text-align: left;
  }
}
</style>
