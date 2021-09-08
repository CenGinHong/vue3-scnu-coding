import { apiGetCourseComment } from '../comment'
import { pageParams } from '../../common'
import { Moment } from 'moment'

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
    avatarUrl: string
  }
  createdAt: Moment
  updatedAt: Moment
  replyComments: commentResp[]
}

export interface getCourseCommentResp extends commentResp{
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

export interface getLabCommentResp extends commentResp{
  labId: number
  replyComments: getLabCommentResp[]
}

export interface insertLabCommentReq {
  labId: number
  commentText: string
  pid: number
}

export interface deleteCommentReq {
  commentId: number
}
