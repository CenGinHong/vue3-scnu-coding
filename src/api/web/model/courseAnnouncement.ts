import { IFileItem, pageParams } from '../../common'
import { Dayjs } from 'dayjs'

export interface courseAnnouncementListResp {
  courseAnnouncementId: number
  title: string
  content: string
  attachmentSrc: string
  updatedAt: Dayjs
  fileList: IFileItem[]
}

export interface insertCourseAnnouncementReq {
  title: string
  content: string
  attachmentSrc: string
  courseId: number
}

export interface updateCourseAnnouncementReq {
  courseAnnouncementId: number
  title: string
  content: string
  attachmentSrc?: string
}

export interface getCourseAnnouncementReq extends pageParams {
  courseId: number
}
