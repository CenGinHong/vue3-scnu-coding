<template>
  <a-upload
    :file-list="imageList"
    :action="uploadApi"
    :before-upload="beforeUpload"
    class="avatar-uploader"
    list-type="picture-card"
    @change="handleImageUploadChange"
    @preview="handlePreview"
  >
    <template v-if="imageList.length < imageLength">
      <plus-outlined />
      <div class="ant-upload-text">Upload</div>
    </template>
  </a-upload>
  <a-modal v-model:visible="previewVisible" :footer="null">
    <img :src="previewImage" alt="example" style="width: 100%" />
  </a-modal>
</template>

<script lang="ts" setup>
// 上传文件列表
import { createVNode, ref } from 'vue'
import { FileInfo, IFileItem } from '../../api/common'
import { getBase64 } from '../../util/utils'
import { message, Modal } from 'ant-design-vue'
import { VueCropper } from 'vue-cropper'
import { uploadApi } from '../../api/web/file'
import { PlusOutlined } from '@ant-design/icons-vue'
// eslint-disable-next-line no-undef,func-call-spacing
const emits = defineEmits<{
  (e: 'update:imageList', list: any[]): void
  (e: 'update:loading', src: boolean): void
}>()

// eslint-disable-next-line no-undef
const props = withDefaults(
  // eslint-disable-next-line no-undef
  defineProps<{
    loading?: boolean
    imageList: IFileItem[]
    imageSize: number
    imageLength?: number
  }>(),
  {
    loading: false,
    imageLength: 1,
    imageSize: 1
  }
)

const cropper = ref()

// 上传前修改，进行图片裁剪
const beforeUpload = async(file: any) => {
  return new Promise((resolve, reject) => {
    const supportType = ['image/jpeg', 'image/png']
    if (!supportType.includes(file.type)) {
      message.error('不支持的图片类型')
      reject(Error('不支持的图片类型'))
      return
    }
    const isLt2M = file.size / 1024 / 1024 < Number(props.imageSize)
    if (!isLt2M) {
      message.error(`图片大小需小于 ${props.imageSize} MB!`)
      reject(Error(`图片需小于 ${props.imageSize} MB!`))
      return
    }
    getBase64(file).then((img) => {
      Modal.info({
        title: () => '裁剪照片',
        icon: () => {},
        closable: true,
        content: () =>
          createVNode('div', { style: 'height: 360px' }, [
            createVNode(VueCropper, {
              ref: cropper,
              autoCrop: true,
              autoCropHeight: 180,
              autoCropWidth: 320,
              centerBox: true,
              fixed: true,
              fixedNumber: [16, 9],
              img: img,
              outputType: 'jpg'
            })
          ]),
        width: '640px',
        onOk: () => {
          cropper.value.getCropBlob((data: Blob) => {
            const newFile: IFileItem = new File([data], file.name, {
              lastModified: file.lastModified,
              type: data.type
            })
            newFile.uid = file.uid
            resolve(newFile)
          })
        },
        okText: () => '裁剪'
      })
    })
  })
}

// 是否可预览
const previewVisible = ref<boolean>(false)
// 预览图片
const previewImage = ref<string | undefined>('')

// 处理预览
const handlePreview = async(file: IFileItem) => {
  if (!file.url && !file.preview) {
    file.preview = (await getBase64(file.originFileObj!)) as string
    previewImage.value = file.preview
  } else if (file.url) {
    previewImage.value = file.url
  }
  previewVisible.value = true
}

const handleImageUploadChange = (info: FileInfo) => {
  emits('update:imageList', info.fileList)
  const status = info.file.status
  // 上传成功
  switch (status) {
    case 'done': {
      emits('update:loading', false)
      message.success(`${info.file.name}上传成功`)
      // // 将文件url置入
      break
    }
    case 'error': {
      emits('update:loading', false)
      message.error(`${info.file.name}上传失败`)
      break
    }
    case 'removed': {
      emits('update:loading', false)
      break
    }
    case 'uploading': {
      emits('update:loading', true)
      break
    }
  }
}
</script>

<style lang="scss" module></style>
