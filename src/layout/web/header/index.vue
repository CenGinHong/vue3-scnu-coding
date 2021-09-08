<template>
  <a-layout-header :class="style.layoutHeader">
    <a-row justify="end" :class="style.row1">
      <a-col span="1">
        <github-outlined @click="handleOpenGithub"/>
      </a-col>
      <a-col span="1">
        <a-dropdown>
          <a-avatar>{{ userInfo.username }}</a-avatar>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <a @click="handleRouterToHomePage">
                  <user-outlined/>
                  个人中心
                </a>
              </a-menu-item>
              <a-menu-divider/>
              <a-menu-item>
                <a @click.prevent="doLogout">
                  <poweroff-outlined/>
                  退出登录</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-col>
    </a-row>
    <!--<div :class="style.rightOptions">-->

    <!--</div>-->
  </a-layout-header>
  <!--<ALayoutHeader class="layout-header">-->

  <!--</ALayoutHeader>-->
</template>

<script lang="ts">
import { computed, createVNode, defineComponent, useCssModule } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { GithubOutlined, PoweroffOutlined, QuestionCircleOutlined, UserOutlined } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import { useRequest } from 'vue-request'
import { TOKEN_KEY } from '../../../enums/cacheEnum'
import { useStore } from '../../../store'
import { RoleEnum } from '../../../enums/roleEnum'
import { ROUTER_NAME } from '../../../router'
import { IUserInfo } from '../../../store/modules/user/state'
import { apiUpdateLab } from '../../../api/web/lab'

interface IState {
  username: string
}

export default defineComponent({
  name: 'PageHeader',
  components: {
    PoweroffOutlined,
    UserOutlined,
    GithubOutlined
  },
  props: {
    collapsed: {
      type: Boolean
    }
  },
  setup () {
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

    const { run: runLogout, error: errLogout } = useRequest(apiUpdateLab)
    // 退出登录
    const doLogout = () => {
      Modal.confirm({
        title: '您确定要退出登录吗？',
        icon: createVNode(QuestionCircleOutlined),
        onOk: async () => {
          console.log(router, '退出登录')
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

    const style = useCssModule()
    return {
      style,
      handleOpenGithub,
      userInfo,
      handleRouterToHomePage,
      doLogout
    }
  }
})
</script>

<style lang="scss" module>
.layoutHeader {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  height: 64px;
  padding: 0;
  background-color: #fff;
  justify-content: flex-end;
  align-items: center;

  .row1 {
    width: 100%;
  }
}

//.rightOptions {
//  display: flex;
//  align-items: center;
//
//  > * {
//    margin-right: 20px;
//    cursor: pointer;
//  }
//}
</style>
