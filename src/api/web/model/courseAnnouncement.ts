import {IFileItem, pageParams} from '../../common'
import {Moment} from 'moment'

export interface courseAnnouncementListResp {
  courseAnnouncementId: number
  title: string,
  content: string,
  attachmentFileDetail: {
    localFileId: number
    filename: string
    size: number
    url: string
    contentType: string
  }
  updatedAt: Moment
}

export interface insertCourseAnnouncementReq {
  title: string,
  content: string,
  attachmentFileId?: number
  courseId: number
}

export interface updateCourseAnnouncementReq {
  courseAnnouncementId: number
  title: string,
  content: string,
  attachmentFileId?: string
}

export interface getCourseAnnouncementReq extends pageParams {
  courseId: number
}
