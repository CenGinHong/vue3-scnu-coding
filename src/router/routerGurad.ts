import { RouteLocationRaw, Router } from 'vue-router'
import MyLocalStorage from '../util/MyLocalStorage'
import { ACCESS_TOKEN } from '../store/mutation-types'
import { ROUTER_NAME } from './index'
import store, { useStore } from '../store'
import { RoleEnum } from '../enums/roleEnum'
import { message } from 'ant-design-vue'

export function redirectToHomePage (): RouteLocationRaw {
  const roleId: number = store.getters['user/userInfo'].roleId
  const to: RouteLocationRaw = {}
  switch (roleId) {
    case RoleEnum.STUDENT: {
      to.name = ROUTER_NAME.STUDENT_HOME_PAGE
      break
    }
    case RoleEnum.TEACHER: {
      to.name = ROUTER_NAME.TEACHER_HOME_PAGE
      break
    }
  }
  return to
}

export function createRouteGuards (router: Router) {
  router.beforeEach((to, from, next) => {
    // 若未定义该路由,跳转到错误页
    const isExist = router.getRoutes().some(route => route.path === to.path)
    if (!isExist) {
      next({ name: ROUTER_NAME.ERROR_404 })
    }
    const token = MyLocalStorage.get(ACCESS_TOKEN)
    // 已登录
    if (token) {
      // 已登录还访问登录页，重定向到首页
      if (to.name === ROUTER_NAME.LOGIN) {
        next(redirectToHomePage())
      } else {
        if (to.meta.requiresAuth) {
          const userInfo = store.getters['user/userInfo']
          const isExist = to.meta.accessRole!.some(item => item === userInfo.role)
          if (!isExist) {
            // 不在该页面访问的权限之中
            message.error('您未拥有权限')
            return false
          }
          next()
        }
      }
    } else {
      // 未登录又访问需要权限的页面
      if (to.meta.requiresAuth) {
        message.warn('您尚未登陆，请先登录')
        next({ name: ROUTER_NAME.LOGIN, query: { redirect: to.fullPath }, replace: true })
      }
      next()
    }
  })
}
