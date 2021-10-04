<template>
  <div :class="style.outer">
    <v-md-editor
      :model-value="reportContent?.reportContent"
      height="450px"
      mode="preview"
    ></v-md-editor>
  </div>
</template>

<script lang="ts">
import { defineComponent, useCssModule } from 'vue'
import { useRoute } from 'vue-router'
import { useRequest } from 'vue-request'
import {
  apiGetReportContent,
  apiUpdateReportContent
} from '../../api/web/labSubmit'

export default defineComponent({
  name: 'ReportReadBoard',
  setup() {
    const route = useRoute()
    const labId = Number(route.query.labId)
    // 获取之前撰写的实验报告的内容
    const { data: reportContent } = useRequest(apiGetReportContent, {
      manual: false,
      defaultParams: [
        {
          labId
        }
      ],
      formatResult: (res) => {
        return res.data.result
      }
    })

    const { run: runUpdateReportContent } = useRequest(apiUpdateReportContent)
    // 保存编写的实验报告
    const handleSave = (text: string, _: string) => {
      // 保存
      runUpdateReportContent({ labId, reportContent: text })
    }

    const style = useCssModule()
    return {
      reportContent,
      style,
      handleSave
    }
  }
})
</script>
<style lang="scss" module>
.outer {
  margin: 20px 10px 0 10px;
  text-align: left;
}
</style>
