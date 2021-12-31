<template>
  <a-skeleton active :loading="loadingCourseDetail">
    <a-form
        :label-col="{ span: 3 }"
        :model="updateCourseState"
        :rules="rules"
        :wrapper-col="{ span: 20 }"
    >
      <a-form-item label="课程名称" name="courseName">
        <a-input v-model:value="updateCourseState.courseName"/>
      </a-form-item>
      <a-form-item label="课程描述" name="courseDes">
        <a-textarea
            v-model:value="updateCourseState.courseDes"
            :maxlength="250"
            allow-clear
            rows="5"
            showCount
        />
      </a-form-item>
      <a-form-item label="课程密钥" name="secretKey">
        <a-input v-model:value="updateCourseState.secretKey"/>
      </a-form-item>
      <a-form-item label="是否结课">
        <a-switch v-model:checked="updateCourseState.isClose"/>
      </a-form-item>
      <a-form-item label="课程封面">
        <upload-image-modal
            v-model:image-list="fileList"
            v-model:loading="loadingUpload"
            :imageSize="2"
        />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 3 }">
        <a-space>
          <a-button type="primary" @click="handleUpdateCourse" :loading="loadingUpdateCourse || loadingUpload">修改</a-button>
          <a-button type="primary" danger @click="handleDeleteCourse" :loading="loadingDeleteCourse">删除</a-button>
          <a-button @click="handleCancel">取消</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </a-skeleton>
</template>

<script lang="ts" setup>
import { useRequest } from 'vue-request'
import { apiDeleteCourse, apiGetCourseDetail, apiUpdateCourse } from '../../../api/web/course'
import { reactive, ref, watchEffect } from 'vue'
import { updateCourseReq } from '../../../api/web/model/courseModel'
import { IFileItem } from '../../../api/common'
import { message } from 'ant-design-vue'
import { fileSrc2File } from '../../../util/utils'
import { useForm } from 'ant-design-vue/es/form'
import UploadImageModal from '../../common/UploadImageModal.vue'
import { useRouter } from 'vue-router'
import { ROUTER_NAME } from '../../../router'
import { RuleObject } from 'ant-design-vue/es/form/interface'

// eslint-disable-next-line no-undef
const props = defineProps<{
  courseId: number
}>()

// eslint-disable-next-line no-undef,func-call-spacing
const emits = defineEmits<{
  (e: 'finish', res: boolean): void
}>()

// 更新课程表单数据
const updateCourseState = reactive<updateCourseReq>({
  courseId: Number(props.courseId),
  courseName: '',
  courseDes: '',
  coverImg: '',
  secretKey: '',
  isClose: false
})

// 更新表单api
const {
  run: runUpdateCourse,
  loading: loadingUpdateCourse,
  error: errUpdateCourse
} = useRequest(apiUpdateCourse)

// 获取课程详情
const {
  loading: loadingCourseDetail
} = useRequest(apiGetCourseDetail, {
  manual: false,
  defaultParams: [props.courseId],
  formatResult: (res) => {
    return res.data.result
  },
  onSuccess: (res) => {
    updateCourseState.courseId = res.courseId
    updateCourseState.courseName = res.courseName
    updateCourseState.courseDes = res.courseDes
    updateCourseState.secretKey = res.secretKey
    updateCourseState.isClose = res.isClose
    // 注意这下面两句不能调换，否则不能正确监听图片的变化
    fileList.value = [
      fileSrc2File(
        res.coverImg
      )
    ]
    updateCourseState.coverImg = undefined
  }
})

// 表单字段规则
const rules = reactive<Record<string, RuleObject[]>>({
  courseName: [
    { required: true, message: '请输入课程名' },
    { max: 16, message: '课程名最长16字' }
  ],
  courseDes: [{ required: true, message: '请输入课程描述' }],
  secretKey: [{ pattern: /^\d{6}$/, message: '需为6位数字' }]
})

// 初始化上传数据用的
const fileList = ref<IFileItem[]>([])

watchEffect(() => {
  if (fileList.value.length === 0) {
    updateCourseState.coverImg = ''
  } else if (fileList.value[0].status === 'done') {
    updateCourseState.coverImg =
        fileList.value[0].response!.result!.fileSrc
  }
})

const loadingUpload = ref<Boolean>(false)

const { validate } = useForm(updateCourseState, rules)

// 更新课程
const handleUpdateCourse = async() => {
  try {
    await validate()
  } catch (err) {
    message.error('输入数据不满足提交要求')
    return
  }
  await runUpdateCourse(updateCourseState)
  if (errUpdateCourse.value) {
    return
  }
  emits('finish', true)
}

const handleCancel = () => {
  emits('finish', false)
}

const { run: runDeleteCourse, loading: loadingDeleteCourse, error: errDeleteCourse } = useRequest(apiDeleteCourse)

const router = useRouter()

const handleDeleteCourse = async() => {
  await runDeleteCourse(props.courseId)
  if (errDeleteCourse.value) {
    return
  }
  // 跳回主页
  await router.replace({
    name: ROUTER_NAME.TEACHER_HOME_PAGE
  })
}
</script>

<style scoped>

</style>
