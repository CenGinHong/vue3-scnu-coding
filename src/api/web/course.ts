import {
  courseDetailResp,
  createCourseReq,
  getIsCourseEnrollReq,
  getIsCourseEnrollResp,
  getIsCourseOpenByTeacherReq,
  getIsCourseOpenByTeacherResp,
  insertStudent2ClassReq,
  insertStudent2ClassResp, joinClassReq,
  listCourseResp,
  listCourseStudentOverviewResp,
  listCourseStudentReq,
  removeFromClassReq,
  searchCourseReq,
  searchCourseResp,
  updateCourseReq
} from './model/courseModel'
import { pageParams, pageResp, Result } from '../common'
import instance from '../../util/axios/axios'
import {ListOneStudentScoreReq, ListOneStudentScoreResp} from "./model/lab";

enum Api {
  courseJoin = '/web/course/join',
  isCourseJoin = '/web/course/join/is',
  getCourseTeacher = '/web/course/teacher',
  listSearchCourse = '/web/course/search',
  course = '/web/course',
  courseOverview = '/web/course/overview',
  isCourseOpenByTeacher = '/web/course/open',
  manageStudentInClass = '/web/course/student',
  score = '/web/course/score',
}

export function apiListCourseByStuId(params: pageParams) {
  return instance.get<Result<pageResp<listCourseResp>>>(Api.courseJoin, {
    params: params
  })
}

export function apiListCourseByTeacherId(params: pageParams) {
  return instance.get<Result<pageResp<listCourseResp>>>(Api.getCourseTeacher, {
    params
  })
}

export function apiSearchCourse(params: searchCourseReq) {
  return instance.get<Result<pageResp<searchCourseResp>>>(
    Api.listSearchCourse,
    {
      params
    }
  )
}

export function apiGetCourseDetail(courseId: number) {
  return instance.get<Result<courseDetailResp>>(Api.course + '/' + courseId)
}

export function apiListCourseOverview(params: listCourseStudentReq) {
  return instance.get<Result<pageResp<listCourseStudentOverviewResp>>>(
    Api.courseOverview,
    {
      params
    }
  )
}

export function apiGetIsCourseEnroll(params: getIsCourseEnrollReq) {
  return instance.get<Result<getIsCourseEnrollResp>>(Api.isCourseJoin, {
    params
  })
}

// 该课程是由该老师创建
export function apiGetIsCourseOpenByTeacher(
  params: getIsCourseOpenByTeacherReq
) {
  return instance.get<Result<getIsCourseOpenByTeacherResp>>(
    Api.isCourseOpenByTeacher,
    {
      params
    }
  )
}

export function apiInsertStudent2Class(data: insertStudent2ClassReq) {
  return instance.post<insertStudent2ClassReq, Result<insertStudent2ClassResp>>(
    Api.manageStudentInClass,
    data
  )
}

export function apiRemoveStudentFromClass(params: removeFromClassReq) {
  return instance.delete<Result>(Api.manageStudentInClass, {
    params
  })
}

export function apiCreateCourse(data: createCourseReq) {
  return instance.post<createCourseReq, Result>(Api.course, data)
}

export function apiUpdateCourse(data: updateCourseReq) {
  return instance.put<updateCourseReq, Result>(Api.course, data)
}

export function apiDeleteCourse(id :number) {
  return instance.delete<Result>(Api.course + '/' + id)
}

export function apiJoinClass(data: joinClassReq) {
  return instance.post<Result>(Api.courseJoin, data)
}

export function apiListOneStudentScore(params: ListOneStudentScoreReq) {
  return instance.get<Result<pageResp<ListOneStudentScoreResp>>>(Api.score, {
    params: params
  })
}
