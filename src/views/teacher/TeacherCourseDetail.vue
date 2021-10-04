<template>
  <a-row :class="style.row1">
    <a-col :class="style.courseInfo" span="24">
      <template v-if="loadingCourseDetail">
        <a-skeleton active />
      </template>
      <template v-else>
        <a-row align="top">
          <a-col :span="7">
            <a-image
              :height="135"
              :src="dataCourseDetail?.coverImg"
              :width="240"
              fallback="https://via.placeholder.com/240x135?text=%E5%8A%A0%E8%BD%BD%E5%A4%B1%E8%B4%A5"
            />
          </a-col>
          <a-col :span="17">
            <div :class="style.textArea">
              <span :class="style.title">
                {{ dataCourseDetail?.courseName }}
              </span>
              <a-tag
                :class="style.tag"
                :color="dataCourseDetail?.isClose ? 'success' : 'default'"
              >
                {{ dataCourseDetail?.isClose ? '进行中' : '已结课' }}
              </a-tag>
              <edit-outlined @click="handleShowModalUpdateCourse" />
              <p :class="style.courseDes">{{ dataCourseDetail?.courseDes }}</p>
            </div>
          </a-col>
        </a-row>
      </template>
    </a-col>
  </a-row>
  <a-row :class="style.functionalArea">
    <a-col span="24">
      <a-tabs
        v-model:activeKey="tabsActiveKey"
        :class="style.antTabs"
        size="large"
      >
        <a-tab-pane key="1" tab="课程实验">
          <teacher-lab-list :course-id="Number(courseId)" />
        </a-tab-pane>
        <a-tab-pane key="2" tab="课程公告">
          <teacher-announcement-list :course-id="Number(courseId)" />
        </a-tab-pane>
        <a-tab-pane key="3" tab="课程评论">
          <div :class="style.contentPadding">
            <course-comment :course-id="Number(courseId)" />
          </div>
        </a-tab-pane>
        <a-tab-pane key="4" tab="课程签到">
          <div :class="style.contentPadding">
            <teacher-checkin-table :course-id="Number(courseId)" />
          </div>
        </a-tab-pane>
        <a-tab-pane key="5" tab="学生管理">
          <div :class="style.contentPadding">
            <teacher-course-manage-table :course-id="Number(courseId)" />
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-col>
  </a-row>
  <a-modal
    v-model:visible="visibleModalUpdateCourse"
    :ok-button-props="{ loading: loadingUpdateCourse }"
    :disable="loadingUpload"
    cancel-text="取消"
    ok-text="修改"
    width="800px"
    @ok="handleUpdateCourse"
  >
    <a-form
      :label-col="{ span: 3 }"
      :model="updateCourseState"
      :rules="rules"
      :wrapper-col="{ span: 20 }"
    >
      <a-form-item label="课程名称" name="courseName">
        <a-input v-model:value="updateCourseState.courseName" />
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
        <a-input v-model:value="updateCourseState.secretKey" />
      </a-form-item>
      <a-form-item label="编程语言">
        <a-tooltip title="编程语言无法修改">
          <a-radio-group
            :options="languageEnumRadioOption"
            :value="updateCourseState?.languageType"
            disabled
          />
        </a-tooltip>
      </a-form-item>
      <a-form-item label="是否结课">
        <a-switch v-model:checked="updateCourseState.isClose" />
      </a-form-item>
      <a-form-item label="课程封面">
        <upload-image-modal
          v-model:image-init-list="updateCourseImageInitList"
          v-model:loading="loadingUpload"
          :size-limits="2"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { reactive, ref, useCssModule, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import TeacherLabList from '../../components/web/teacher/TeacherLabList.vue'
import TeacherCheckinTable from '../../components/web/teacher/TeacherCheckinTable.vue'
import CourseComment from '../../components/web/CourseComment.vue'
import TeacherAnnouncementList from '../../components/web/teacher/TeacherAnnouncementList.vue'
import { useRequest } from 'vue-request'
import { apiGetCourseDetail, apiUpdateCourse } from '../../api/web/course'
import TeacherCourseManageTable from '../../components/web/teacher/TeacherCourseManageTable.vue'
import { EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { updateCourseReq } from '../../api/web/model/courseModel'
import 'vue-cropper/dist/index.css'
import UploadImageModal from '../../components/common/UploadImageModal.vue'
import { fileSrc2File } from '../../util/utils'
import { IFileItem } from '../../api/common'
import { Form, message } from 'ant-design-vue'

const useForm = Form.useForm

// eslint-disable-next-line no-undef
const props = defineProps<{
  courseId: string
}>()

// 获取课程详情
const {
  data: dataCourseDetail,
  loading: loadingCourseDetail,
  refresh: refreshCourseDetail
} = useRequest(apiGetCourseDetail, {
  manual: false,
  defaultParams: [Number(props.courseId)],
  formatResult: (res) => {
    return res.data.result
  }
})

// 更新表单
const {
  run: runUpdateCourse,
  loading: loadingUpdateCourse,
  error: errUpdateCourse
} = useRequest(apiUpdateCourse)

// 更新课程表单数据
const updateCourseState = reactive<updateCourseReq>({
  courseId: Number(props.courseId),
  courseName: '',
  courseDes: '',
  coverImg: '',
  secretKey: '',
  isClose: false
})

// 表单字段规则
const rules = reactive({
  courseName: [
    { required: true, message: '请输入课程名', trigger: 'blur' },
    { max: 16, message: '课程名最长16字' }
  ],
  courseDes: [{ required: true, message: '请输入课程描述', trigger: 'blur' }],
  secretKey: [{ pattern: /^\d{6}$/, message: '需为6位数字', trigger: 'blur' }]
})
const { validate } = useForm(updateCourseState, rules)

// 初始化上传数据用的
const updateCourseImageInitList = ref<IFileItem[]>([])

watchEffect(() => {
  if (updateCourseImageInitList.value.length === 0) {
    updateCourseState.coverImg = ''
    return
  }
  if (updateCourseImageInitList.value[0].status === 'done') {
    updateCourseState.coverImg =
      updateCourseImageInitList.value[0].response.result.fileSrc
  }
})

const loadingUpload = ref<Boolean>(false)

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
  visibleModalUpdateCourse.value = false
  await refreshCourseDetail()
}

// 课程更新窗口是否可见
const visibleModalUpdateCourse = ref<boolean>(false)

// 修改课程更新窗口是否可见性
const handleShowModalUpdateCourse = () => {
  updateCourseState.courseId = dataCourseDetail.value!.courseId
  updateCourseState.courseName = dataCourseDetail.value!.courseName
  updateCourseState.courseDes = dataCourseDetail.value!.courseDes
  updateCourseState.secretKey = dataCourseDetail.value!.secretKey
  updateCourseState.isClose = dataCourseDetail.value!.isClose
  // 注意这下面两句不能调换，否则不能正确监听图片的变化
  updateCourseImageInitList.value = [
    fileSrc2File(
      'http://contentcms-bj.cdn.bcebos.com/cmspic/f80cec7f79249ada5c1db17ea0eb5964.jpeg'
    )
  ]
  updateCourseState.coverImg = undefined
  visibleModalUpdateCourse.value = true
}

// 语言单选选项
const languageEnumRadioOption = [
  { label: 'Cpp', value: 1 },
  { label: 'Java', value: 2 },
  { label: 'Python', value: 3 }
]

const tabsActiveKey = ref<string>('1')
const route = useRoute()
const style = useCssModule()
</script>

<style lang="scss" module>
.courseInfo:hover {
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.25);
}

.row1 {
  margin-left: 100px;
  margin-right: 100px;
  margin-top: 20px;
  min-height: 200px;

  .courseInfo {
    background-color: white;
    border-radius: 8px;
    padding: 20px 20px 20px 20px;
    transition: box-shadow 0.3s;

    .courseCover {
      height: 153px;
      width: 272px;
    }

    .textArea {
      text-align: left;
      margin-left: 20px;

      .title {
        font-size: 22px;
        font-weight: bold;
        color: black;
      }

      .tag {
        margin-left: 10px;
      }
    }
  }
}

.functionalArea:hover {
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.25);
}

.functionalArea {
  margin-left: 100px;
  margin-right: 100px;
  margin-top: 20px;
  border-radius: 8px;
  background-color: white;
  transition: box-shadow 0.3s;
  padding-left: 24px;
  padding-right: 24px;
  padding-bottom: 16px;

  .antTabs {
    padding-top: 16px;
    margin: 0;
  }

  .contentPadding {
    padding-left: 24px;
    padding-right: 24px;
  }
}
</style>

<style lang="scss" scoped>
::v-deep(.ant-tabs-nav-wrap) {
  display: flex;
  margin-left: 16px;
}
</style>
