import {
  courseDetailResp,
  listCourseResp,
  getIsCourseEnrollReq,
  getIsCourseEnrollResp,
  listCourseStudentReq,
  listCourseStudentOverviewResp,
  searchCourseReq,
  searchCourseResp,
  getIsCourseOpenByTeacherReq,
  getIsCourseOpenByTeacherResp,
  insertStudent2ClassReq,
  insertStudent2ClassResp, removeFromClassReq
} from './model/courseModel'
import { pageParams, pageResp, Result } from '../common'
import instance from '../../util/axios/axios'
import { remove } from 'lodash-es'

enum Api {
  getCourseByStuId = '/web/course/enroll',
  getCourseTeacher = '/web/course/teacher',
  listSearchCourse = '/web/course/search',
  course = '/web/course',
  courseOverview = '/web/course/overview',
  isCourseEnroll = '/web/course/is-enroll',
  isCourseOpenByTeacher = '/web/course/open',
  manageStudentInClass ='/web/course/student'
}

export function apiListCourseByStuId (params: pageParams) {
  return instance.get<Result<pageResp<listCourseResp>>>(Api.getCourseByStuId, {
    params: params
  })
}

export function apiListCourseByTeacherId (params: pageParams) {
  return instance.get<Result<pageResp<listCourseResp>>>(Api.getCourseTeacher, {
    params
  })
}

export function apiSearchCourse (params: searchCourseReq) {
  return instance.get<Result<pageResp<searchCourseResp>>>(Api.listSearchCourse, {
    params: params
  })
}

export function apiGetCourseDetail (courseId: number) {
  return instance.get<Result<courseDetailResp>>(Api.course + '/' + courseId)
}

export function apiListCourseOverview (params: listCourseStudentReq) {
  return instance.get<Result<pageResp<listCourseStudentOverviewResp>>>(Api.courseOverview, {
    params
  })
}

export function apiGetIsCourseEnroll (params: getIsCourseEnrollReq) {
  return instance.get<Result<getIsCourseEnrollResp>>(Api.isCourseEnroll, {
    params
  })
}

// 该课程时候该老师创建
export function apiGetIsCourseOpenByTeacher (params: getIsCourseOpenByTeacherReq) {
  return instance.get<Result<getIsCourseOpenByTeacherResp>>(Api.isCourseOpenByTeacher, {
    params
  })
}

export function apiInsertStudent2Class (data:insertStudent2ClassReq) {
  return instance.post<Result<insertStudent2ClassResp>>(Api.manageStudentInClass, data)
}

export function apiRemoveStudentFromClass (params:removeFromClassReq) {
  return instance.delete<Result>(Api.manageStudentInClass, {
    params
  })
}
