<template>
  <a-upload
      :file-list="imageList"
      :action="uploadApi"
      :before-upload="beforeUpload"
      class="avatar-uploader"
      list-type="picture-card"
      accept=".jpg,.jpeg"
      @preview="handlePreview"
  >
    <template v-if="imageList.length < imageLength">
      <plus-outlined/>
      <div class="ant-upload-text">Upload</div>
    </template>
  </a-upload>
  <a-modal v-model:visible="previewVisible" :footer="null">
    <a-image :src="previewImage" alt="example" style="width: 100%"/>
  </a-modal>
  <!--  裁剪框-->
  <a-modal v-model:visible="cropperVisible"
           :ok="crop"
           :destroy-on-close="true"
           :footer="null"
           width="560px">
    <div class="copperDiv">
      <vue-cropper ref="cropper"
                   :auto-crop="true"
                   :auto-crop-height="180"
                   :auto-crop-width="320"
                   :centerBox="true"
                   :fixed="true"
                   :fixed-number="[16, 9]"
                   :img="imgBase64"
                   outputType="jpg"/>
    </div>
    <a-space>
      <a-button @click="handleCancelCropperModal">
        取消
      </a-button>
      <a-button type="primary" @click="crop">
        裁剪
      </a-button>
    </a-space>
  </a-modal>
</template>

<script lang="ts" setup>
// 上传文件列表
import { ref } from 'vue'
import { getBase64 } from '../../util/utils'
import { message, UploadProps } from 'ant-design-vue'
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper'
import { uploadApi } from '../../api/web/file'
import { PlusOutlined } from '@ant-design/icons-vue'
import { UploadFile } from 'ant-design-vue/es/upload/interface'
// eslint-disable-next-line no-undef,func-call-spacing
const emits = defineEmits<{
  (e: 'update:imageList', list: UploadFile[]): void
}>()

// eslint-disable-next-line no-undef
const props = withDefaults(
  // eslint-disable-next-line no-undef
  defineProps<{
      loading?: boolean
      imageList?: UploadFile[]
      imageSize?: number
      imageLength?: number
    }>(),
  {
    loading: false,
    imageLength: 1,
    imageSize: 5,
    imageList: () => []
  }
)

const cropper = ref()

const cropperVisible = ref<boolean>(false)

const imgBase64 = ref<String>('')

const tmp = ref()

const crop = () => {
  // 获取cropper值
  cropper.value.getCropBlob((data: any) => {
    const newFile: any = new File([data], tmp.value.name, {
      lastModified: tmp.value.lastModified,
      type: data.type
    })
    newFile.uid = tmp.value.uid
    const newArray = props.imageList.slice(0, props.imageList.length - 1)
    newArray.push(newFile)
    emits('update:imageList', newArray)
    cropperVisible.value = false
  })
}

// 上传前修改，进行图片裁剪
const beforeUpload: UploadProps['beforeUpload'] = file => {
  const supportType = ['image/jpeg', 'image/png']
  if (file.type === undefined || !supportType.includes(file.type)) {
    message.error('不支持的图片类型')
    return
  }
  if (file.size === undefined || file.size / 1024 < Number(props.imageSize)) {
    message.error(`图片大小需小于 ${props.imageSize} MB!`)
    return
  }
  tmp.value = file
  getBase64(file).then((img) => {
    imgBase64.value = img
    // previewVisible.value= true
    cropperVisible.value = true
  })
  return false
}

// 是否可预览
const previewVisible = ref<boolean>(false)
// 预览图片
const previewImage = ref<string | undefined>('')

// 处理预览
const handlePreview = async(file: UploadFile) => {
  if (!file.url && !file.preview) {
    file.preview = (await getBase64(file.originFileObj!)) as string
    previewImage.value = file.preview
  } else if (file.url) {
    previewImage.value = file.url
  }
  previewVisible.value = true
}

const handleCancelCropperModal = () => {
  cropperVisible.value = false
}
</script>

<style lang="scss" scoped>

.copperDiv {
  width: 480px;
  height: 270px;
  margin-bottom: 16px;
}

</style>
