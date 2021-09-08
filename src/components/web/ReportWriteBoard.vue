<template>
  <div :class="style.outer">
    <v-md-editor v-model="reportContent"
                 :disabled-menus="[]"
                 height="450px"
                 @save="handleSave"
                 @upload-image="handleUploadImage"/>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, useCssModule } from 'vue'
import { useRequest } from 'vue-request'
import { apiGetReportContent, apiUpdateReportContent } from '../../api/web/labSubmit'
import { useRoute } from 'vue-router'
import { apiUploadFile } from '../../api/web/file'
import { message } from 'ant-design-vue'

export default defineComponent({
  name: 'ReportWriteBoard',
  setup () {
    const route = useRoute()
    const labId = Number(route.query.labId)

    const reportContent = ref<string>('')
    // 获取之前撰写的实验报告的内容
    useRequest(apiGetReportContent, {
      manual: false,
      defaultParams: [{
        labId
      }],
      formatResult: (res) => {
        return res.data.result
      },
      onSuccess: (res) => {
        reportContent.value = res.reportContent
      }
    })

    const { run: runUpdateReportContent } = useRequest(apiUpdateReportContent)
    // 保存编写的实验报告
    const handleSave = (text: string, _: string) => {
      // 保存
      runUpdateReportContent({ labId, reportContent: text })
    }

    const { run: runUploadImage, data: dataUploadImage, error: errUploadImage } = useRequest(apiUploadFile, {
      formatResult: (res) => {
        return res.data.result
      }
    })
    const handleUploadImage = async (event: Event,
      insertImage: (imageConfig: any) => void, files: any[]) => {
      const image = files[0]
      // 仅支持上传图像
      const supportUploadType: string[] = ['image/jpeg', 'image/png']
      if (image.type === undefined || !supportUploadType.includes(image.type)) {
        message.error('不支持的上传文件类型')
        return
      }
      // 限制图片大小
      const isLt2M = image.size / 1024 / 1024 < 2
      if (!isLt2M) {
        message.error('图片大小需小于2MB!')
        return
      }
      // 上传图片
      const uploadForm = new FormData()
      uploadForm.set('file', image)
      await runUploadImage(uploadForm)
      if (errUploadImage.value) {
        return
      }
      insertImage({
        url: dataUploadImage.value!.url,
        desc: image.name
      })
    }

    const style = useCssModule()
    return {
      reportContent,
      style,
      handleSave,
      handleUploadImage
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
