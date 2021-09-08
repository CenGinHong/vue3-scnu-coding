<template>
  <a-row :class="style.row1">
    <a-col span="6">
      <a-card :class="style.card" hoverable>
        <template #cover>
          <img alt="example"
               src="/src/assets/gate.jpg"/>
        </template>
        <template #actions class="ant-card-actions">
          <edit-outlined @click="handleShowUpdateUserInfoModal"/>
          <send-outlined @click="visibleModalOpenIDE=true"/>
        </template>
        <a-card-meta description="This is the description" title="陈健航">
          <template #avatar>
            <a-avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"/>
          </template>
        </a-card-meta>
      </a-card>
    </a-col>
    <a-col span="1">
    </a-col>
    <a-col :class="style.courseList"
           span="17">
      <a-tabs v-model:activeKey="tabsActiveKey"
              size="large">
        <a-tab-pane key="1" tab="我的课程">
          <teacher-course-list/>
        </a-tab-pane>
        <a-tab-pane key="2" tab="所有课程">
        </a-tab-pane>
      </a-tabs>
    </a-col>
  </a-row>
  <a-modal v-model:visible="visibleUpdateUserInfo"
           :ok-button-props="{loading: loadingUpdateUserInfo}"
           title="修改个人资料"
           width="520px"
           @ok="handleUpdateUserInfo">
    <a-form ref="updateUserInfoFormRef"
            :label-col="{ span: 4 }"
            :model="updateUserInfo"
            :rules="rules"
            :wrapper-col="{ span: 16 }">
      <a-form-item label="姓名"
                   name="username">
        <a-input v-model:value="updateUserInfo.username"/>
      </a-form-item>
      <a-form-item label="学号"
                   name="userNum">
        <a-input v-model:value="updateUserInfo.userNum"/>
      </a-form-item>
      <a-form-item label="邮箱"
                   name="email">
        <a-input v-model:value="updateUserInfo.email"/>
      </a-form-item>
      <template v-if="!isShowVerCodeInput">
        <a-form-item label="验证码"
                     name="verCode">
          <a-input-search v-model:value="updateUserInfo.verCode"
                          @search="handleSendMail">
            <template #enterButton>
              <a-button :disabled="disabledSendMail"
                        type="primary">
                {{ sendMailBtuText }}
              </a-button>
            </template>
          </a-input-search>
        </a-form-item>
      </template>
      <a-form-item label="学院"
                   name="school">
        <a-input v-model:value="updateUserInfo.school"/>
      </a-form-item>
      <a-form-item label="专业" name="major">
        <a-input v-model:value="updateUserInfo.major"/>
      </a-form-item>
      <a-form-item label="性别" name="gender">
        <a-radio-group v-model:value="updateUserInfo.gender"
                       :options="genderRadioOption"/>
      </a-form-item>
      <a-form-item label="单位"
                   name="organization">
        <a-input v-model:value="updateUserInfo.organization"/>
      </a-form-item>
      <a-form-item label="旧密码" name="oldPassword">
        <a-input-password v-model:value="updateUserInfo.oldPassword"
                          placeholder="当需要修改密码时需要验证新密码"/>
      </a-form-item>
      <a-form-item label="新密码"
                   name="newPassword">
        <a-input-password v-model:value="updateUserInfo.password"
                          :disabled="updateUserInfo.oldPassword===''"
                          placeholder="输入新密码"/>
      </a-form-item>
      <a-form-item label="重复新密码" name="repeatPassword">
        <a-input-password v-model:value="updateUserInfo.repeatPassword"
                          :disabled="updateUserInfo.oldPassword===''"
                          placeholder="确认新密码"/>
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal v-model:visible="visibleModalOpenIDE"
           @ok="handleOpenIDE"
           :ok-button-props="{loading: loadingOpenIde}"
           cancel-text="取消"
           ok-text="打开IDE" title="请选择IDE的语言环境"
           width="280px">
    <a-radio-group v-model:value="selectLanguageValue"
                   :options="languageRadioOption"/>
  </a-modal>
</template>

<script lang="ts" setup>
import { EditOutlined, SendOutlined } from '@ant-design/icons-vue'
import { computed, reactive, ref, useCssModule } from 'vue'
import { useRequest } from 'vue-request'
import { OpenIDE } from '../../api/web/ide'
import { radioOption } from '../../api/common'
import { useStore } from '../../store'
import { IUserInfo } from '../../store/modules/user/state'
import { message } from 'ant-design-vue'
import { apiGetUserInfo, apiUpdateUserInfo } from '../../api/web/user'
import { updateUserInfoReq } from '../../api/web/model/userModel'
import { RuleObject } from 'ant-design-vue/es/form/interface'
import TeacherCourseList from '../../components/web/teacher/TeacherCourseList.vue'

interface IUpdateUserInfoState extends updateUserInfoReq {
  repeatPassword: string,
}

const store = useStore()
const userInfo = computed<IUserInfo>(() => store.getters['user/userInfo'])
const tabsActiveKey = ref<string>('1')

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
    return res.data.result!.url
  }
})
// 打开ide
const handleOpenIDE = async () => {
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
  }, {
    value: 2,
    label: 'Java'
  },
  {
    value: 3,
    label: 'Python'
  }]

// 获取自己的详细信息
const { data: dataGetUserInfo, error: errGetUserInfo, refresh: refreshGetUserInfo } = useRequest(apiGetUserInfo, {
  manual: false,
  formatResult: (res) => {
    return res.data.result
  }
})
const updateUserInfoFormRef = ref()
const visibleUpdateUserInfo = ref<boolean>(false)
const isShowVerCodeInput = computed<boolean>(() => dataGetUserInfo.value?.email === updateUserInfo.email)
const rules = {
  username: [{ required: true, trigger: 'change', message: '姓名不能为空' }],
  userNum: [{ required: true, trigger: 'change', message: '学号不能为空' }, {
    pattern: /^[0-9]*$/, message: '学号需为数字'
  }],
  email: [{ required: true, trigger: 'change', message: '邮箱不能为空' }, {
    pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '需满足邮箱格式'
  }],
  major: [{ required: true, trigger: 'change', message: '专业不能为空' }],
  school: [{ required: true, trigger: 'change', message: '学院不能为空' }],
  verCode: [{ pattern: /^\d{6}$/, message: '验证码为6为纯数字' }, {
    validator: (rule: RuleObject, value: string) => {
      if (updateUserInfo.email !== dataGetUserInfo.value?.email && value === '') {
        return Promise.reject(new Error('重置邮箱需要验证码'))
      }
    }
  }],
  newPassword: [{ pattern: /^[a-zA-Z]\w{5,17}$/, message: '长度在6~18之间，只能包含字母、数字和下划线' }],
  repeatPassword: [{
    validator: (rule: RuleObject, value: string) => {
      if (value !== updateUserInfo.password) {
        return Promise.reject(new Error('两次输入的密码不一致'))
      }
    }
  }]
}
const { run: runUpdateUserInfo, loading: loadingUpdateUserInfo } = useRequest(apiUpdateUserInfo)
// 更新用户数据
const updateUserInfo = reactive<IUpdateUserInfoState>({
  username: '',
  userNum: '',
  email: '',
  verCode: '',
  gender: 0,
  school: '',
  avatarUrl: '',
  grade: 0,
  major: '',
  oldPassword: '',
  password: '',
  repeatPassword: '',
  organization: ''
})
const handleShowUpdateUserInfoModal = async () => {
  if (errGetUserInfo.value) {
    message.error('获取个人信息失败，请刷新页面重试')
    return
  }
  updateUserInfo.username = dataGetUserInfo.value!.username
  updateUserInfo.userNum = dataGetUserInfo.value!.userNum
  updateUserInfo.email = dataGetUserInfo.value!.email
  updateUserInfo.gender = dataGetUserInfo.value!.gender
  updateUserInfo.school = dataGetUserInfo.value!.school
  updateUserInfo.avatarUrl = dataGetUserInfo.value!.avatarUrl
  updateUserInfo.grade = dataGetUserInfo.value!.grade
  updateUserInfo.major = dataGetUserInfo.value!.major
  updateUserInfo.organization = dataGetUserInfo.value!.organization
  updateUserInfo.major = dataGetUserInfo.value!.major
  visibleUpdateUserInfo.value = true
}

// 更新数据
const handleUpdateUserInfo = async () => {
  await runUpdateUserInfo(updateUserInfo)
  await refreshGetUserInfo()
}

// 发送验证码
const sendMailBtuText = ref<string>('获取验证码')
const disabledSendMail = ref<boolean>(false)
let timer: any
const handleSendMail = () => {
  const TIME_COUNT = 60
  if (!timer) {
    disabledSendMail.value = true
    let count = TIME_COUNT
    timer = setInterval(() => {
      if (count > 0 && count <= TIME_COUNT) {
        count--
        sendMailBtuText.value = String(count) + 's后可重发'
      } else {
        clearInterval(timer)
        timer = null
        sendMailBtuText.value = '获取验证码'
        disabledSendMail.value = false
      }
    }, 1000)
  }
}

// 性别多选框
const genderRadioOption: radioOption[] = [
  {
    value: 0,
    label: '保密'
  }, {
    value: 1,
    label: '男'
  },
  {
    value: 2,
    label: '女'
  }]
const style = useCssModule()
</script>

<style lang="scss" module>

.courseList:hover {
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.25);
}

.row1 {
  margin-left: 100px;
  margin-right: 100px;
  margin-top: 20px;
  border-radius: 10px;
  min-height: 420px;

  .courseList {
    background-color: white;
    border-radius: 8px;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 20px;
    min-height: 420px;
    transition: box-shadow 0.3s;
  }
}

.echarts {
  height: 150px;
}

</style>

<style lang="scss" scoped>
::v-deep(.ant-tabs-nav-scroll) {
  float: left;
  margin-left: 16px;
  margin-top: 16px;
}
</style>
