<template>
  <a-row class="row1">
    <a-col :span="6" :offset="2">
      <a-card class="card">
        <template #cover>
          <img alt="example" src="/src/assets/gate.jpg" />
        </template>
        <template  #actions >
          <edit-outlined @click="handleShowDrawer" />
          <code-sandbox-outlined @click="visibleModalOpenIDE = true" />
        </template>
        <a-card-meta
          :title="userInfo.username"
          description="This is the description"
        >
          <template #avatar>
            <a-avatar>username</a-avatar>
          </template>
        </a-card-meta>
      </a-card>
    </a-col>
    <a-col :span="13" :offset="1">
        <div class="codingTimeDiv">
          <coding-time-div/>
        </div>
      <div class="courseList" >
        <a-tabs v-model:activeKey="tabsActiveKey" size="large">
          <a-tab-pane key="1" tab="我的课程">
            <student-course-list />
          </a-tab-pane>
          <a-tab-pane key="2" tab="所有课程">
            <search-course-list />
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-col>
  </a-row>
  <a-modal
      :footer="null"
      title="个人信息"
      width="640px"
      v-model:visible="visibleDrawer">
    <update-user-info-form/>
  </a-modal>
  <a-modal
    v-model:visible="visibleModalOpenIDE"
    :ok-button-props="{ loading: loadingOpenIde }"
    cancel-text="取消"
    ok-text="打开IDE"
    title="请选择IDE的语言环境"
    width="280px"
  >
    <a-radio-group
      v-model:value="selectLanguageValue"
      :options="languageRadioOption"
    />
  </a-modal>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRequest } from 'vue-request'
import { OpenIDE } from '../../api/web/ide'
import {
  BarChartOutlined,
  EditOutlined,
  CodeSandboxOutlined
} from '@ant-design/icons-vue'
import SearchCourseList from '../../components/web/SearchCourseList.vue'
import StudentCourseList from '../../components/web/student/StudentCourseList.vue'
import { useStore } from '../../store'
import { radioOption } from '../../api/common'
import { IUserInfo } from '../../store/modules/user/state'
import CodingTimeDiv from '../../components/web/CodingTimeDiv.vue'
import UpdateUserInfoForm from '../../components/web/UpdateUserInfoForm.vue'

const store = useStore()
const userInfo = computed<IUserInfo>(() => store.getters['user/userInfo'])

// tab切换
const tabsActiveKey = ref<string>('1')

const visibleModalOpenIDE = ref<boolean>(false)
// IDE语言选择
const selectLanguageValue = ref<number>(1)
// 打开ide api
const {
  run: apiOpenIde,
  loading: loadingOpenIde,
  error: errorOpenIde,
  data: ideUrl
} = useRequest(OpenIDE, {
  formatResult: (res:any) => {
    return res.data.result!.url
  }
})

// 语言多选框
const languageRadioOption: radioOption[] = [
  {
    value: 1,
    label: 'Cpp'
  },
  {
    value: 2,
    label: 'Java'
  },
  {
    value: 3,
    label: 'Python'
  }
]

const visibleDrawer = ref<boolean>(false)

const handleShowDrawer = () => {
  visibleDrawer.value = true
}

</script>

<style lang="scss" scoped>

.row1 {
  margin-top: 20px;

  .codingTimeDiv {
    background-color: white;
    border-radius: 8px;
    padding-bottom: 20px;
    transition: box-shadow 0.3s;
    display: flex;
    justify-content: center;
    align-content: center;
  }

  .courseList {
    margin-top: 20px;
    background-color: white;
    border-radius: 8px;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 20px;
    min-height: 420px;
    transition: box-shadow 0.3s;
  }
}

</style>

<style lang="scss" scoped>
::v-deep(.ant-tabs-nav-wrap) {
  margin-left: 16px;
}
</style>
