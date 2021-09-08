import { App, InjectionKey } from 'vue'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { Store } from 'vuex'
import { IStore } from '../store/types'
import Demo from '../components/web/Demo.vue'
import { RoleEnum } from '../enums/roleEnum'
import { useRequest } from 'vue-request'
import { apiGetIsCourseEnroll, apiGetIsCourseOpenByTeacher } from '../api/web/course'
import { message } from 'ant-design-vue'
import { error } from 'echarts/types/src/util/log'

export const key: InjectionKey<Store<IStore>> = Symbol('')

export enum ROUTER_NAME {
  LOGIN = 'login',
  ERROR_404 = 'error-404',
  FORGET_PASSWORD = 'forget-password',
  STUDENT_HOME_PAGE = 'student-homepage',
  STUDENT_COURSE_DETAIL = 'student-course-detail',
  REPORT_WRITE_BOARD = 'report-write-board',
  TEACHER_HOME_PAGE = 'teacher-homepage',
  TEACHER_COURSE_DETAIL = 'teacher-course-detail',
  TEACHER_LAB_DETAIL = 'teacher-lab-detail'
}

declare module 'vue-router' {
  interface RouteMeta {
    title: string
    // 每个路由都必须声明
    requiresAuth: boolean
    accessRole?: RoleEnum[]
  }
}

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/dev',
    name: 'dev',
    component: Demo,
    meta: {
      title: '测试',
      requiresAuth: false
    }
  },
  {
    path: '/error-404',
    name: ROUTER_NAME.ERROR_404,
    component: () => import('../views/common/Error404.vue'),
    meta: {
      requiresAuth: false,
      title: '404错误'
    }
  },
  {
    path: '/login',
    name: ROUTER_NAME.LOGIN,
    component: () => import('../views/common/Login.vue'),
    meta: {
      requiresAuth: false,
      title: '登录'
    }
  },
  {
    path: '/forget-password',
    name: ROUTER_NAME.FORGET_PASSWORD,
    component: () => import('../views/common/ForgetPassword.vue'),
    meta: {
      requiresAuth: false,
      title: '找回密码'
    }
  },
  {
    path: '/web',
    component: () => import('../layout/web/index.vue'),
    children: [
      {
        path: 'student',
        component: () => import('../components/web/RouterTransition.vue'),
        children: [
          {
            path: 'homepage',
            name: ROUTER_NAME.STUDENT_HOME_PAGE,
            component: () => import('../views/student/StudentHomePage.vue'),
            meta: {
              title: '学生主页',
              requiresAuth: true,
              accessRole: [RoleEnum.STUDENT]
            }
          },
          {
            path: 'course/:courseId',
            name: ROUTER_NAME.STUDENT_COURSE_DETAIL,
            component: () => import('../views/student/StudentCourseDetail.vue'),
            props: true,
            meta: {
              title: '课程详情',
              requiresAuth: true,
              accessRole: [RoleEnum.STUDENT]
            },
            beforeEnter: async (to, from) => {
              const courseId = Number(to.params.courseId)
              const { data, run } = useRequest(apiGetIsCourseEnroll, {
                formatResult: (res) => {
                  return res.data.result
                }
              })
              await run({
                courseId
              })
              // 没有加入该课程阻止跳转
              if (!(data.value!.isEnroll)
              ) {
                message.error('你尚未加入该课程')
                return false
              }
            }
          }
        ]
      },
      {
        path: 'report-write-board',
        name:
        ROUTER_NAME.REPORT_WRITE_BOARD,
        component:
          () => import('../components/web/ReportWriteBoard.vue'),
        meta:
          {
            title: '实验报告',
            requiresAuth:
              true,
            accessRole:
              [RoleEnum.STUDENT]
          }
      },
      {
        path: 'teacher',
        component: () => import('../components/web/RouterTransition.vue'),
        children:
          [
            {
              path: 'homepage',
              name: ROUTER_NAME.TEACHER_HOME_PAGE,
              meta: {
                title: '教师主页',
                requiresAuth: true,
                accessRole: [RoleEnum.TEACHER]
              },
              component: () => import('../views/teacher/TeacherHomepage.vue')
            },
            {
              path: 'course/:courseId',
              name: ROUTER_NAME.TEACHER_COURSE_DETAIL,
              component: () => import('../views/teacher/TeacherCourseDetail.vue'),
              props: true,
              meta: {
                title: '课程详情',
                requiresAuth: true,
                accessRole: [RoleEnum.TEACHER]
              },
              beforeEnter: async (to, from) => {
                const courseId = Number(to.params.courseId)
                const { data, run, error } = useRequest(apiGetIsCourseOpenByTeacher, {
                  formatResult: (res) => {
                    console.log(res)
                    return res.data.result
                  }
                })
                await run({
                  courseId
                })
                if (error.value) {
                  return
                }
                // 不是这个老师开课阻止跳转
                if (!(data.value!.isOpen)) {
                  message.error('该课程并非您所创建')
                  return false
                }
              }
            },
            {
              path: 'lab/:labId',
              name: ROUTER_NAME.TEACHER_LAB_DETAIL,
              component: () => import('../views/teacher/TeacherLabDetail.vue'),
              props: true,
              meta: {
                title: '实验详情',
                requiresAuth: true,
                accessRole: [RoleEnum.TEACHER]
              }
            }
          ]
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export function setupRouter (app: App) {
  app.use(router, key)
}
