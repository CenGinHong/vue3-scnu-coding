import instance from '../../util/axios/axios'
import { pageResp, Result } from '../common'
import { listCourseEnrollReq, listCourseEnrollResp, listCourseResp, updateCourseReq } from './model/courseModel'

enum Api {
  getCourseByStuId = '/web/course/enroll',
  getCourseTeacher = '/web/course/teacher',
  listSearchCourse = '/web/course/search',
  course = '/admin/course',
  enroll = '/admin/course/enroll',
  courseOverview = '/web/course/overview',
  isCourseEnroll = '/web/course/is-enroll',
  isCourseOpenByTeacher = '/web/course/open',
  manageStudentInClass = '/web/course/student',
}

export function apiListAllCourse() {
  return instance.get<Result<pageResp<listCourseResp>>>(Api.course)
}

export function apiUpdateCourse(data: updateCourseReq) {
  return instance.put<updateCourseReq, Result>(Api.course, data)
}

export function apiListCourseEnroll(params: listCourseEnrollReq) {
  return instance.get<Result<pageResp<listCourseEnrollResp>>>(Api.enroll, {
    params
  })
}