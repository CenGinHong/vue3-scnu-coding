<template>
  <a-row class="row1">
    <a-col :span="6" :offset="1">
      <a-card class="card">
        <template #cover>
          <img alt="example" src="/src/assets/gate.jpg" />
        </template>
        <template #actions class="ant-card-actions">
          <edit-outlined @click="visibleUpdateUserInfo=true" />
          <send-outlined @click="visibleModalOpenIDE = true" />
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
    <a-col :span="1"> </a-col>
    <a-col :span="15" class="col1">
      <teacher-course-list />
<!--      <a-tabs v-model:activeKey="tabsActiveKey" size="large">-->
<!--        <a-tab-pane key="1" tab="我的课程">-->
<!--          -->
<!--        </a-tab-pane>-->
<!--        <a-tab-pane key="2" tab="所有课程"> </a-tab-pane>-->
<!--      </a-tabs>-->
    </a-col>
  </a-row>
  <a-modal
    v-model:visible="visibleUpdateUserInfo"
    title="修改个人资料"
    width="520px"
    :footer="null"
  >
    <update-user-info-form @finish="handleFinishUpdateUserInfo"/>
  </a-modal>
  <a-modal
    v-model:visible="visibleModalOpenIDE"
    @ok="handleOpenIDE"
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
import { EditOutlined, SendOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue'
import { useRequest } from 'vue-request'
import { OpenIDE } from '../../api/web/ide'
import { radioOption } from '../../api/common'
import { message } from 'ant-design-vue'
import TeacherCourseList from '../../components/web/teacher/TeacherCourseList.vue'
import UpdateUserInfoForm from '../../components/web/UpdateUserInfoForm.vue'
import { useStore } from '../../store'

// const tabsActiveKey = ref<string>('1')

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

const handleFinishUpdateUserInfo = (res:boolean) => {
  if (res) {
    // 刷新用户信息
    store.dispatch('user/getUserInfo')
  }
  visibleUpdateUserInfo.value = false
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
