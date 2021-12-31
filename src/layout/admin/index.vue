<template>
  <pro-layout
    v-model:collapsed="baseState.collapsed"
    v-model:selectedKeys="baseState.selectedKeys"
    v-model:openKeys="baseState.openKeys"
    v-bind="state"
  >
    <template #menuHeaderRender>
      <a>
        <img src="/src/assets/logo.gif" />
        <h1>Scnu Coding</h1>
      </a>
    </template>
    <!-- custom right-content -->
    <template #rightContentRender>
      <div style="margin-right: 12px">
        <a-avatar shape="square" size="small">
          <template #icon>
            <UserOutlined />
          </template>
        </a-avatar>
      </div>
    </template>

    <!-- custom menu-item -->
    <template #menuItemRender="{ item, icon }">
      <a-menu-item
        :key="item.path"
        :disabled="item.meta?.disabled"
        :danger="item.meta?.danger"
        :icon="icon"
      >
        <router-link :to="{ path: item.path }">
          <span class="ant-pro-menu-item">
            <a-badge count="5" dot>
              <span class="ant-pro-menu-item-title">{{ item.meta.title }}</span>
            </a-badge>
          </span>
        </router-link>
      </a-menu-item>
    </template>

    <!-- content begin -->
    <router-view />
    <!-- content end -->
    <footer-toolbar>
      <template #extra>
        <span>FooterToolbar</span>
      </template>
    </footer-toolbar>
  </pro-layout>
</template>

<script lang="ts" setup>
import { computed, reactive, watchEffect } from 'vue'
import {
  RouteContextProps,
  FooterToolbar,
  MenuData,
  clearMenuItem
} from '@ant-design-vue/pro-layout'
import { RouteRecordRaw, useRouter } from 'vue-router'
import { UserOutlined, DashboardOutlined } from '@ant-design/icons-vue'
import { ROUTER_NAME } from '../../router'
import { each } from 'lodash'

const baseState = reactive<Omit<RouteContextProps, 'menuData'>>({
  // 选中的条目
  selectedKeys: [],
  // 打开的条目
  openKeys: [],
  // default
  collapsed: false
})

const router = useRouter()

const formatRelativePath = (
  routes: RouteRecordRaw[],
  breadcrumb: Record<string, any>,
  parent?: RouteRecordRaw
): RouteRecordRaw[] => {
  // 计算路由绝对路径
  return routes.map((route) => {
    if (parent) {
      route.path = `${parent.path || ''}/${route.path}`
    } else {
      route.path = `/${route.path}`
    }
    route.path = route.path.replace('//', '/')
    // format children routes
    if (route.children && route.children.length > 0) {
      route.children = formatRelativePath(route.children, breadcrumb, route)
    }
    breadcrumb[`${route.path}`] = route
    return route
  })
}

const getMenuData = (routes: RouteRecordRaw[]): MenuData => {
  let childrenRoute = routes.find((route) => route.name === 'admin')
  if (childrenRoute) {
    childrenRoute = removeMenuItem(childrenRoute)
  }
  const breadcrumb: Record<string, any> = {}
  return {
    menuData: formatRelativePath(
      childrenRoute?.children || ([] as RouteRecordRaw[]),
      breadcrumb
    ),
    breadcrumb
  }
}

const removeMenuItem = (childrenRoute: RouteRecordRaw) => {
  if (childrenRoute.children) {
    for (let i = 0; i < childrenRoute.children.length; i++) {
      if (childrenRoute.children[i].meta?.isMenuItem === false) {
        childrenRoute.children.splice(i, 1);
        i--
      } else {
        removeMenuItem(childrenRoute.children[i])
      }
    }
  }
  return childrenRoute
}


const { menuData } = getMenuData(clearMenuItem(router.getRoutes()))

const state = reactive({
  menuData,
  splitMenus: false,
  navTheme: 'light',
  layout: 'mix',
  fixSiderbar: true
})

watchEffect(() => {
  if (router.currentRoute) {
    const matched = router.currentRoute.value.matched.concat()
    baseState.selectedKeys = matched
      .filter((r) => r.name !== 'index')
      .map((r) => r.path)
    baseState.openKeys = matched
      .filter((r) => r.path !== router.currentRoute.value.path)
      .map((r) => r.path)
  }
})
</script>

<style scoped>
</style>
