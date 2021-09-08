import instance from '../../util/axios/axios'
import { deleteReq, pageResp, Result } from '../common'
import {
  courseAnnouncementListResp,
  getCourseAnnouncementReq,
  insertCourseAnnouncementReq,
  updateCourseAnnouncementReq
} from './model/courseAnnouncement'
import { deleteLabReq } from './model/lab'

enum Api {
  CourseAnnouncement = '/web/course/announcement',
}

export function apiListCourseAnnouncement (params: getCourseAnnouncementReq) {
  return instance.get<Result<pageResp<courseAnnouncementListResp>>>(Api.CourseAnnouncement, {
    params
  })
}

export function apiDeleteCourseAnnouncement (params: deleteReq) {
  return instance.delete<Result>(Api.CourseAnnouncement, {
    params
  })
}

export function apiInsertCourseAnnouncement (data: insertCourseAnnouncementReq) {
  return instance.post<Result>(Api.CourseAnnouncement, data)
}

export function apiUpdateCourseAnnouncement (data: updateCourseAnnouncementReq) {
  return instance.put<Result>(Api.CourseAnnouncement, data)
}
