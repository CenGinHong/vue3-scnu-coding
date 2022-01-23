<template>
  <a-row class="row">
    <a-col class="col" :span="20" :offset="2">
      <v-md-editor
        v-model="reportContent"
        :disabled-menus="[]"
        height="500px"
        @save="handleSave"
        @upload-image="handleUploadImage"
      />
    </a-col>
  </a-row>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useRequest } from 'vue-request'
import {
  apiGetReportContent,
  apiUpdateReportContent
} from '../../api/web/labSubmit'
import { apiUploadFile } from '../../api/web/file'
import { message } from 'ant-design-vue'
// eslint-disable-next-line no-undef
const props = defineProps<{
  labId: number
}>()

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

const { run: runUpdateReportContent } = useRequest(apiUpdateReportContent)
// 保存编写的实验报告
const handleSave = (text: string, _: string) => {
  // 保存
  runUpdateReportContent({ labId: props.labId, reportContent: text })
}

const {
  run: runUploadImage,
  data: dataUploadImage,
  error: errUploadImage
} = useRequest(apiUploadFile, {
  formatResult: (res) => {
    return res.result
  }
})
const handleUploadImage = async(
  event: Event,
  insertImage: (imageConfig: any) => void,
  files: any[]
) => {
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
    url: dataUploadImage.value!.fileSrc,
    desc: image.name
  })
}
</script>
<style lang="scss" scoped>
.row {
  margin-top: 20px;
  .col {
    text-align: left;
  }
}
</style>
