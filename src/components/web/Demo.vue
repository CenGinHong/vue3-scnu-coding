<template>
  <a-button @click="test">test</a-button>
    <a-button @click="show">
      <upload-outlined/>
      点击上传
    </a-button>
</template>

<script lang="ts" setup>
import { defineComponent, ref, toRaw } from 'vue'
import { useRequest } from 'vue-request'
import { DeleteOutlined } from '@ant-design/icons-vue'
import { apiTest } from '../../api/web/user'
import { apiUploadFile } from '../../api/web/file'
import { IFileItem } from '../../api/common'
import { message } from 'ant-design-vue'

const show = () => {
  console.log(123)
}
//
// export default defineComponent({
//   name: 'TeacherCourseManageTable',
//   components: {
//     DeleteOutlined
//   },
//   setup () {
//     const { run } = useRequest(apiUploadFile)
//     const fileList = ref<FileItem[]>([])
//     const be = (file:FileItem) => {
//       fileList.value = [...fileList.value, file]
//       return false
//     }
//     const test = () => {
//       message.error('123')
//     }
//     return {
//       test,
//       be,
//       fileList
//     }
//   }
//
// })
</script>

<style lang="scss" scoped>

</style>
