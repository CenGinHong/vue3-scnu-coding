<template>
  <a-row class="row1">
    <a-col :span="5" :offset="2">
      <a-card class="card">
        <template #cover>
          <img alt="example" src="/src/assets/gate.jpg"/>
        </template>
        <template #actions>
          <edit-outlined @click="handleShowDrawer"/>
          <code-sandbox-outlined @click="visibleModalOpenIDE = true"/>
        </template>
        <a-card-meta description="This is the description" title="陈健航">
          <template #avatar>
            <a-avatar
                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            />
          </template>
        </a-card-meta>
      </a-card>
    </a-col>
    <a-col :span="1"></a-col>
    <a-col :span="14" class="col1">
      <teacher-course-list/>
<!--      <a-tabs v-model:activeKey="tabsActiveKey" size="large">-->
<!--        <a-tab-pane key="1" tab="我的课程">-->
<!--          <teacher-course-list/>-->
<!--        </a-tab-pane>-->
<!--        <a-tab-pane key="2" tab="所有课程"></a-tab-pane>-->
<!--      </a-tabs>-->
    </a-col>
  </a-row>
  <a-modal
      title="个人信息"
      width="420px"
      :footer="null"
      v-model:visible="visibleDrawer">
    <update-user-info-form/>
  </a-modal>
</template>

<script lang="ts" setup>
import { EditOutlined, CodeSandboxOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue'
import { useRequest } from 'vue-request'
import { OpenIDE } from '../../api/web/ide'
import { radioOption } from '../../api/common'
import { message } from 'ant-design-vue'
import TeacherCourseList from '../../components/web/teacher/TeacherCourseList.vue'
import UpdateUserInfoForm from '../../components/web/UpdateUserInfoForm.vue'
import { useStore } from '../../store'

const tabsActiveKey = ref<string>('1')

const store = useStore()
const userInfo = store.getters['user/userInfo']

// 语言框可见
const visibleModalOpenIDE = ref<boolean>(false)
// IDE语言选择
const selectLanguageValue = ref<number>(1)
// api打开ide
const {
  run: apiOpenIde,
  loading: loadingOpenIde,
  error: errorOpenIde,
  data: dataIdeUrl
} = useRequest(OpenIDE, {
  formatResult: (res) => {
    return res.result!.url
  }
})
// 打开ide
const handleOpenIDE = async() => {
  // 向后台申请打开ide容器
  await apiOpenIde({ languageEnum: selectLanguageValue.value })
  if (errorOpenIde.value) {
    message.error(errorOpenIde.value)
    return
  }
  // 新打开页面
  window.open(dataIdeUrl.value)
}

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

const visibleUpdateUserInfo = ref<boolean>(false)

const visibleDrawer = ref<boolean>(false)

const handleShowDrawer = () => {
  visibleDrawer.value = true
}

</script>

<style lang="scss" scoped>

.row1 {
  margin-top: 20px;
  border-radius: 10px;
  min-height: 420px;

  .col1 {
    background: white;
    border-radius: 10px;
    padding: 20px 10px 20px 10px;
  }
}
</style>

<style lang="scss" scoped>
::v-deep(.ant-tabs-nav-wrap) {
  margin-left: 16px;
}
</style>
