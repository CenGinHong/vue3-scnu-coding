<template>
  <a-row>
    <a-col span="24">
      <a-button :class="style.insertBtn" type="primary" @click="visibleModalInsertCourse=true">
        <form-outlined/>
        新建课程
      </a-button>
    </a-col>
  </a-row>
  <a-row>
    <a-col span="24">
      <base-course-list :dataSource="dataSource?.records"
                      :loading="loading"
                      :pag="pag"/>
    </a-col>
  </a-row>
  <a-modal v-model:visible="visibleModalInsertCourse"
           title="新建课程"
           width="800px">
    <a-form ref="updateUserInfoFormRef"
            :label-col="{ span: 4 }"
            :model="insertCourseForm"
            :wrapper-col="{ span: 18 }">
      <a-form-item label="课程名"
                   name="courseName">
        <a-input v-model:value="insertCourseForm.courseName"/>
      </a-form-item>
      <a-form-item label="课程简介"
                   name="courseDes">
        <a-textarea v-model:value="insertCourseForm.courseDes"
                    rows="5"/>
      </a-form-item>
      <a-form-item label="课程密钥" name="SecretKey">
        <a-input v-model:value="insertCourseForm.secretKey"
                 placeholder="请输入6位加入课程的数字密钥"/>
      </a-form-item>
      <a-form-item label="编程语言"
                   name="gender">
        <a-radio-group v-model:value="insertCourseForm.languageType"
                       :options="languageRadioOption"/>
      </a-form-item>
      <a-form-item label="课程封面"
                   name="cover">
        <a-upload
            v-model:file-list="fileList"
            class="avatar-uploader"
            list-type="picture-card"
            @preview="handlePreview">
          <template v-if="fileList.length === 0">
            <plus-outlined></plus-outlined>
            <div class="ant-upload-text">Upload</div>
          </template>
        </a-upload>
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal :visible="previewVisible"
           :footer="null"
           @cancel="handleCancel">
    <img alt="example"
         style="width: 100%"
         :src="previewImage" />
  </a-modal>
</template>

<script lang="ts" setup>
import { computed, defineComponent, reactive, ref, useCssModule } from 'vue'
import { usePagination } from 'vue-request'
import { FileInfo, IFileItem, pagination, radioOption } from '../../../api/common'
import { apiListCourseByTeacherId } from '../../../api/web/course'
import { useRouter } from 'vue-router'
import BaseCourseList from '../BaseCourseList.vue'
import { FormOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { insertCourseReq } from '../../../api/web/model/courseModel'
import { getBase64 } from '../../../util/utils'
// import { VueCropper } from 'vue-cropper'

const router = useRouter()
const {
  data: dataSource,
  loading,
  total,
  current,
  pageSize
} = usePagination(apiListCourseByTeacherId, {
  manual: false,
  formatResult: (res) => {
    return res.data.result
  }
})

// 分页数据
const pag = computed<pagination>(() => ({
  onChange (page: number) {
    current.value = page
  },
  total: total.value,
  pageSize: pageSize.value
}))

const visibleModalInsertCourse = ref<boolean>(false)
const insertCourseForm = reactive<insertCourseReq>({
  courseName: '',
  courseDes: '',
  secretKey: '',
  languageType: 1
})

const languageRadioOption = reactive<radioOption[]>([
  {
    label: 'Cpp',
    value: 1
  },
  {
    label: 'Java',
    value: 2
  },
  {
    label: 'Python',
    value: 3
  }
])

const fileList = ref<IFileItem[]>([])
const previewVisible = ref<boolean>(false)
const previewImage = ref<string | undefined>('')

const handleCancel = () => {
  previewVisible.value = false
}
const handlePreview = async (file: IFileItem) => {
  if (!file.url && !file.preview) {
    file.preview = (await getBase64(file.originFileObj)) as string
  }
  previewImage.value = file.preview
  previewVisible.value = true
}
const handleChange = ({ fileList: newFileList }: FileInfo) => {
  fileList.value = newFileList
}
const style = useCssModule()

</script>

<style lang="scss" module>
.insertBtn {
  float:left;
  margin-left: 16px;
}

</style>
