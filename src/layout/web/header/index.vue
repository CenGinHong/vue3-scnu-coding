<template>
  <a-layout-header class="layoutHeader">
    <a-row class="row1">
      <a-col span="1" :offset="1">
        <img src="/src/assets/scnu.jpg" style="height: 36px" />
      </a-col>
      <a-col span="1" :offset="20">
        <github-outlined @click="handleOpenGithub" />
      </a-col>
      <a-col span="1">
        <a-dropdown>
          <a-avatar>{{ userInfo.username }}</a-avatar>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <a @click="handleRouterToHomePage">
                  <user-outlined />
                  个人主页
                </a>
              </a-menu-item>
              <a-menu-divider />
              <a-menu-item>
                <a @click.prevent="doLogout">
                  <poweroff-outlined />
                  退出登录</a
                >
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-col>
    </a-row>
  </a-layout-header>
</template>

<script lang="ts" setup>
import { computed, createVNode } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  GithubOutlined,
  PoweroffOutlined,
  QuestionCircleOutlined,
  UserOutlined
} from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import { useRequest } from 'vue-request'
import { TOKEN_KEY } from '../../../enums/cacheEnum'
import { useStore } from '../../../store'
import { RoleEnum } from '../../../enums/roleEnum'
import { ROUTER_NAME } from '../../../router'
import { IUserInfo } from '../../../store/modules/user/state'
import { apiUpdateLab } from '../../../api/web/lab'
import { apiLogout } from '../../../api/web/user'

interface IState {
  username: string
}

const router = useRouter()
const route = useRoute()
const store = useStore()
const userInfo = computed<IUserInfo>(() => store.getters['user/userInfo'])

const handleRouterToHomePage = () => {
  const role = store.getters['user/role']
  if (role === RoleEnum.TEACHER) {
    router.push({
      name: ROUTER_NAME.TEACHER_HOME_PAGE
    })
  } else if (role === RoleEnum.STUDENT) {
    router.push({
      name: ROUTER_NAME.STUDENT_HOME_PAGE
    })
  }
}

const { run: runLogout, error: errLogout } = useRequest(apiLogout)
// 退出登录
const doLogout = () => {
  Modal.confirm({
    title: '您确定要退出登录吗？',
    icon: createVNode(QuestionCircleOutlined),
    onOk: async() => {
      await runLogout()
      if (!errLogout.value) {
        message.success('成功退出登录')
        localStorage.removeItem(TOKEN_KEY)
        // 重定向
        await router.replace({
          name: 'login',
          query: {
            redirect: route.fullPath
          }
        })
      }
    }
  })
}

const handleOpenGithub = () => {
  window.open('https://github.com')
}
</script>

<style lang="scss" scoped>
.layoutHeader {
  z-index: 19;
  display: flex;
  height: 48px;
  line-height: 48px;
  padding: 0;
  background-color: #fff;
  box-shadow: 0 1px 4px #00152914;

  .row1 {
    width: 100%;
  }
}

</style>
