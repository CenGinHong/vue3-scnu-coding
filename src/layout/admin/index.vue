<template>
  <pro-layout
      v-model:collapsed="state.collapsed"
      v-model:selectedKeys="state.selectedKeys"
      v-model:openKeys="state.openKeys"
      :menu-data="menuData"
      iconfont-url="//at.alicdn.com/t/font_2804900_2sp8hxw3ln8.js"
      v-bind="proConfig"
  >
    <template #menuHeaderRender>
      <img src="https://alicdn.antdv.com/v2/assets/logo.1ef800a8.svg"/>
      <h1>Scnu Coding</h1>
    </template>
    <template #rightContentRender>
      <div style="margin-right: 12px">
        <a-dropdown>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <template #icon>
                  <SettingOutlined/>
                </template>
                <span>个人设置</span>
              </a-menu-item>
              <a-menu-item>
                <template #icon>
                  <LogoutOutlined/>
                </template>
                <span>退出登录</span>
              </a-menu-item>
            </a-menu>
          </template>
          <a-avatar shape="square" size="small">
            <template #icon>
              <UserOutlined/>
            </template>
          </a-avatar>
        </a-dropdown>
      </div>
    </template>
    <router-view/>
    <template #footerRender>
      <GlobalFooter
          :links="[
          { title: 'Github', href: 'https://github.com/sendya/preview-pro' },
          { title: 'Ant Design Vue', href: 'https://2x.antdv.com' },
        ]"
          copyright="2021 &copy; Sendya"
      />
    </template>
  </pro-layout>
</template>

<script setup lang="ts">
import { reactive, watchEffect, ref } from 'vue'
import { useRouter, RouterLink, RouteRecordRaw } from 'vue-router'
import { UserOutlined, SettingOutlined, LogoutOutlined, SmileOutlined, HeartOutlined } from '@ant-design/icons-vue'
import { GlobalFooter, clearMenuItem, formatRelativePath, getMenuData } from '@ant-design-vue/pro-layout'
import type { RouteContextProps } from '@ant-design-vue/pro-layout'

// 获得路由
const router = useRouter()

const { menuData } = getMenuData(clearMenuItem(router.getRoutes()), router.getRoutes().find(r => {
  return r.name === 'admin'
}))

// 状态
const state = reactive<Omit<RouteContextProps, 'menuData'>>({
  collapsed: false, // default collapsed
  openKeys: [], // defualt openKeys
  selectedKeys: [] // default selectedKeys
})
const proConfig = ref({
  navTheme: 'light',
  layout: 'side',
  fixedHeader: false,
  fixSiderbar: true,
  footerRender: undefined,
  headerRender: undefined
})

// 如果当前路径变了直接变路由
watchEffect(() => {
  if (router.currentRoute) {
    const matched = router.currentRoute.value.matched.concat()
    state.selectedKeys = matched.filter(r => r.name !== 'admin').map(r => r.path)
    state.openKeys = matched
      .filter(r => r.path !== router.currentRoute.value.path)
      .map(r => r.path)
  }
})
</script>
