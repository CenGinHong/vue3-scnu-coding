import { RouteLocationRaw, Router, RouteRecordName } from 'vue-router'
import { ACCESS_TOKEN } from '../store/mutation-types'
import { ROUTER_NAME } from './index'
import store from '../store'
import { RoleEnum } from '../enums/roleEnum'
import { message } from 'ant-design-vue'

export function redirectToHomePage(): string {
  const roleId: number = store.getters['user/userInfo'].roleId
  let to: string = ''
  switch (roleId) {
    case RoleEnum.STUDENT: {
      to = ROUTER_NAME.STUDENT_HOME_PAGE
      break
    }
    case RoleEnum.TEACHER: {
      to = ROUTER_NAME.TEACHER_HOME_PAGE
      break
    }
    case RoleEnum.ADMIN: {
      to = ROUTER_NAME.USER_MANAGEMENT
    }
  }
  return to
}

export function createRouteGuards(router: Router) {
  router.beforeEach((to, from, next) => {
    const isExist = router.getRoutes().some(route => route.name === to.name)
    // 不存在直接跳转到找不到
    // 查前端权限
    if (to.meta.accessRole.length !== 0) {
      const token = store.getters['user/token']
      if (token === undefined || token === '') {
        message.error('您尚未登陆')
        next({ name: ROUTER_NAME.LOGIN })
      }
      const userInfo = store.getters['user/userInfo']
      const isExist = to.meta.accessRole.some(item => item === userInfo.roleId)
      // 可以访问
      if (isExist) {
        next()
      } else {
        message.error('您未拥有权限')
      }
    } else {
      next()
    }
  })
}

// else {
//   if (to.meta.accessRole.length !== 0) {
//     const userInfo = store.getters['user/userInfo']
//     const isExist = to.meta.accessRole.some(item => item === userInfo.role)
//     if(isExist) {
//
//       next()
//     } else {
//       message.error('您未拥有权限')
//     }
//
//   } else {
//   }
// }else {
//   console.log(12)
//   // 已登录
//   if (to.meta.accessRole.length !== 0) {
//     const userInfo = store.getters['user/userInfo']
//     const isExist = to.meta.accessRole.some(item => item === userInfo.role)
//     console.log(34)
//     if (!isExist) {
//       // 不在该页面访问的权限之中
//       message.error('您未拥有权限')
//       return false
//     }
//     console.log(56)
//     next()
//   } else {
//     console.log(78)
//     next()
//   }
// }
