import instance from '../../util/axios/axios'
import { deleteReq, pageResp, Result } from '../common'
import {
  courseAnnouncementDetailResp,
  getCourseAnnouncementReq,
  insertCourseAnnouncementReq,
  updateCourseAnnouncementReq
} from './model/courseAnnouncement'

enum Api {
  CourseAnnouncement = '/web/course/announcement',
}

export function apiListCourseAnnouncement(params: getCourseAnnouncementReq) {
  return instance.get<Result<pageResp<courseAnnouncementDetailResp>>>(
    Api.CourseAnnouncement,
    {
      params
    }
  )
}

export function apiDeleteCourseAnnouncement(id: number) {
  return instance.delete<Result>(Api.CourseAnnouncement + '/' + id)
}

export function apiInsertCourseAnnouncement(data: insertCourseAnnouncementReq) {
  return instance.post<insertCourseAnnouncementReq, Result>(
    Api.CourseAnnouncement,
    data
  )
}

export function apiUpdateCourseAnnouncement(data: updateCourseAnnouncementReq) {
  return instance.put<updateCourseAnnouncementReq, Result>(
    Api.CourseAnnouncement,
    data
  )
}

export function apiGetCourseAnnouncementDetail(id :number) {
  return instance.get<Result>(Api.CourseAnnouncement + '/' + id)
}
