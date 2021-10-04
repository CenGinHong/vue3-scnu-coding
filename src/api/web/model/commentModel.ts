import { pageParams } from '../../common'
import { Dayjs } from 'dayjs'

export interface getCourseCommentReq extends pageParams {
  courseId: number
}

export interface commentResp {
  commentId: number
  commentText: string
  pid: number
  userDetail: {
    userId: number
    username: string
    avatarImg: string
  }
  createdAt: Dayjs
  updatedAt: Dayjs
  replyComments: commentResp[]
}

export interface getCourseCommentResp extends commentResp {
  courseId: number
  replyComments: getCourseCommentResp[]
}

export interface insertCourseCommentReq {
  courseId: number
  commentText: string
  pid: number
}

export interface getLabCommentReq extends pageParams {
  labId: number
}

export interface getLabCommentResp extends commentResp {
  labId: number
  replyComments: getLabCommentResp[]
}

export interface insertLabCommentReq {
  labId: number
  commentText: string
  pid: number
}

export interface deleteCourseCommentReq {
  courseCommentId: number
}

export interface deleteLabCommentReq {
  labCommentId: number
}
