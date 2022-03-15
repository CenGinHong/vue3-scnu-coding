import { App, InjectionKey } from 'vue'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { Store } from 'vuex'
import { IStore } from '../store/types'
import Demo from '../components/web/Demo.vue'
import { RoleEnum } from '../enums/roleEnum'
import { useRequest } from 'vue-request'
import {
  apiGetIsCourseEnroll,
  apiGetIsCourseOpenByTeacher
} from '../api/web/course'
import { message } from 'ant-design-vue'
import { createRouteGuards } from './routerGurad'
import RouterTransition from '../components/web/RouterTransition.vue'
import 'nprogress/css/nprogress.css' // 进度条样式

export const key: InjectionKey<Store<IStore>> = Symbol('')

export enum ROUTER_NAME {
    LOGIN = 'login',
    ERROR_404 = 'error-404',
    FORGET_PASSWORD = 'forget-password',
    STUDENT_HOME_PAGE = 'student-homepage',
    STUDENT_COURSE_DETAIL = 'student-course-detail',
    REPORT_WRITE_BOARD = 'report-write-board',
    REPORT_READ_BOARD = 'report-read-board',
    TEACHER_HOME_PAGE = 'teacher-homepage',
    TEACHER_COURSE_DETAIL = 'teacher-course-detail',
    TEACHER_LAB_DETAIL = 'teacher-lab-detail',
    // admin
    USER_MANAGEMENT = 'user_management',
    STUDENT_MANAGEMENT = 'student_management',
    TEACHER_MANAGEMENT = 'teacher_management',
    COURSE_MANAGEMENT = 'course_management',
    COURSE_MANAGEMENT_LIST = 'course_management_list',
    COURSE_MANAGEMENT_ENROLL = 'course_management_enroll',
    COURSE_MANAGEMENT_COMMENT = 'course_management_comment',
    LAB_MANAGEMENT = 'lab_management',
    LAB_MANAGEMENT_LIST = 'lab_management_list',
    LAB_MANAGEMENT_SUBMIT = 'lab_management_submit',
    CONTAINER_MANAGEMENT = 'container_management',
    CONTAINER_LIST = 'container_list',
    CONTAINER_SERVER_INFO = 'container_server_info'
}

declare module 'vue-router' {
    interface RouteMeta {
        title: string
        // 每个路由都必须声明
        requiresAuth: boolean
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
    path: '/',
    redirect: '/login'
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
    path: '/admin',
    name: 'admin',
    component: () => import('../layout/admin/index.vue'),
    redirect: '/admin/user',
    meta: {
      title: '管理员',
      requiresAuth: false
    },
    children: [
      {
        path: 'user',
        name: ROUTER_NAME.USER_MANAGEMENT,
        meta: {
          requiresAuth: false,
          title: '用户管理'
        },
        component: RouterTransition,
        children: [
          {
            path: 'student',
            name: ROUTER_NAME.STUDENT_MANAGEMENT,
            meta: {
              requiresAuth: false,
              title: '学生管理',
              isMenuItem: true
            },
            component: () => import('../components/admin/StudentInfoTable.vue')
          }
        ]
      },
      {
        path: 'course',
        name: ROUTER_NAME.COURSE_MANAGEMENT,
        component: () => import('../components/admin/CourseTable.vue'),
        meta: {
          requiresAuth: false,
          title: '课程管理'
        }
      },
      {
        path: 'lab',
        name: ROUTER_NAME.LAB_MANAGEMENT,
        meta: {
          requiresAuth: false,
          title: '实验管理'
        },
        component: () => import('../components/admin/LabTable.vue')
      },
      {
        path: 'container',
        name: ROUTER_NAME.CONTAINER_MANAGEMENT,
        meta: {
          requiresAuth: false,
          title: '容器管理'
        },
        component: RouterTransition,
        children: [
          {
            path: 'info',
            name: ROUTER_NAME.CONTAINER_SERVER_INFO,
            meta: {
              requiresAuth: false,
              title: '容器主机'
            },
            component: () => import('../components/admin/ContainerServerInfo.vue')
          }, {
            path: 'list',
            name: ROUTER_NAME.CONTAINER_LIST,
            meta: {
              requiresAuth: false,
              title: '容器管理'
            },
            component: () => import('../components/admin/ContainerTable.vue')
          }
        ]
      }
    ]
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
              requiresAuth: true
            }
          },
          {
            path: 'course/:courseId',
            name: ROUTER_NAME.STUDENT_COURSE_DETAIL,
            component: () => import('../views/student/StudentCourseDetail.vue'),
            props: true,
            meta: {
              title: '课程详情',
              requiresAuth: true
            },
            beforeEnter: async(to) => {
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
              if (!data.value!.isEnroll) {
                message.error('你尚未加入该课程')
                return false
              }
            }
          }
        ]
      },
      {
        path: 'report-write-board',
        name: ROUTER_NAME.REPORT_WRITE_BOARD,
        component: () => import('../components/web/ReportWriteBoard.vue'),
        meta: {
          title: '实验报告',
          requiresAuth: true
        },
        props: route => ({
          labId: Number(route.query.labId)
        })
      },
      {
        path: 'report-read-board',
        name: ROUTER_NAME.REPORT_READ_BOARD,
        component: () => import('../components/web/ReportReadBoard.vue'),
        meta: {
          title: '实验报告',
          requiresAuth: true
        },
        props: route => ({
          labId: Number(route.query.labId)
        })
      },
      {
        path: 'teacher',
        component: () => import('../components/web/RouterTransition.vue'),
        children: [
          {
            path: 'homepage',
            name: ROUTER_NAME.TEACHER_HOME_PAGE,
            meta: {
              title: '教师主页',
              requiresAuth: true
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
              requiresAuth: true
            },
            beforeEnter: async(to) => {
              const courseId = Number(to.params.courseId)
              const { data, run, error } = useRequest(
                apiGetIsCourseOpenByTeacher,
                {
                  formatResult: (res) => {
                    return res.data.result
                  }
                }
              )
              await run({
                courseId
              })
              if (error.value) {
                return
              }
              // 不是这个老师开课阻止跳转
              if (!data.value!.isOpen) {
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
              requiresAuth: true
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

export function setupRouter(app: App) {
  app.use(router, key)
  createRouteGuards(router)
}
