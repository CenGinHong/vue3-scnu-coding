<template>
  <a-form
      :label-col="{ span: 3 }"
      :model="insertAnnouncementState"
      :rules="rules"
      :wrapper-col="{ span: 20 }"
  >
    <a-form-item label="公告名称" name="title">
      <a-input v-model:value="insertAnnouncementState.title"/>
    </a-form-item>
    <a-form-item label="公告内容" name="content">
      <a-textarea v-model:value="insertAnnouncementState.content" rows="5"/>
    </a-form-item>
    <a-form-item label="上传附件">
        <a-upload
            :file-list="fileList"
            :before-upload="beforeUpload"
            @remove="handleRemove"
            :max-count="1"
        >
          <a-button>
            <upload-outlined/>
            点击上传
          </a-button>
        </a-upload>
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 14, offset: 3 }">
      <a-space>
        <a-button type="primary" @click="handleInsertCourseAnnouncement"
                  :loading="loadingInsertCourseAnnouncement || loadingUpload">
         <form-outlined/>
          新建公告
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>

// 新建公告api
import { useRequest } from 'vue-request'
import { apiInsertCourseAnnouncement } from '../../../api/web/courseAnnouncement'
import { message, UploadProps } from 'ant-design-vue'
import { reactive, ref } from 'vue'
import { insertCourseAnnouncementReq } from '../../../api/web/model/courseAnnouncement'
import { UploadOutlined, FormOutlined } from '@ant-design/icons-vue'
import { RuleObject } from 'ant-design-vue/lib/form'
import { useForm } from 'ant-design-vue/es/form'
import { UploadFile } from 'ant-design-vue/es/upload/interface'

// eslint-disable-next-line no-undef
const props = defineProps<{
  courseId: number
}>()

// eslint-disable-next-line no-undef,func-call-spacing
const emits = defineEmits<{
  (e: 'finish', src: boolean): void
}>()

// 新建公告文件列表
const fileList = ref<UploadFile[]>([])
// 新建公告数据
const insertAnnouncementState = reactive<insertCourseAnnouncementReq>({
  title: '',
  content: '',
  attachmentSrc: ''
})

const rules = reactive<Record<string, RuleObject[]>>({
  title: [
    { required: true, message: '标题不能为空' },
    { max: 16, message: '标题最长16字' }
  ],
  content: [{ required: true, message: '内容不能为空' }]
})

const {
  run: runInsertCourseAnnouncement,
  loading: loadingInsertCourseAnnouncement,
  error: errorInsertCourseAnnouncement
} = useRequest(apiInsertCourseAnnouncement)

const loadingUpload = ref<boolean>(false)

const { validate: validateInsertAnnouncement } = useForm(insertAnnouncementState, rules)

const prepareInsertData = (): FormData => {
  const formData = new FormData()
  formData.set('title', insertAnnouncementState.title)
  formData.set('content', insertAnnouncementState.content)
  formData.set('courseId', String(props.courseId))
  if (fileList.value.length > 0) {
    console.log(fileList.value[0])
    formData.set('file', fileList.value[0] as any)
  }
  return formData
}

// 新建公告
const handleInsertCourseAnnouncement = async() => {
  try {
    await validateInsertAnnouncement()
  } catch (err) {
    message.error('输入数据不满足提交要求')
    return
  }
  const formData = prepareInsertData()
  await runInsertCourseAnnouncement(formData)
  if (errorInsertCourseAnnouncement.value) {
    return
  }
  emits('finish', true)
}

const beforeUpload: UploadProps['beforeUpload'] = file => {
  fileList.value = [file]
  return false
}
const handleRemove: UploadProps['onRemove'] = file => {
  const index = fileList.value.indexOf(file)
  const newFileList = fileList.value.slice()
  newFileList.splice(index, 1)
  fileList.value = newFileList
}

</script>

<style scoped>

</style>
