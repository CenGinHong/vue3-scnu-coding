import { pageResp, Result, saveResp } from '../common'
import {
  deleteCourseCommentReq,
  deleteLabCommentReq,
  getCourseCommentReq,
  getCourseCommentResp,
  getLabCommentReq,
  getLabCommentResp,
  insertCourseCommentReq,
  insertLabCommentReq
} from './model/commentModel'
import instance from '../../util/axios/axios'

enum Api {
  CourseComment = '/web/comment/course',
  LabComment = '/web/comment/lab',
}

export function apiListCourseComment(params: getCourseCommentReq) {
  return instance.get<Result<pageResp<getCourseCommentResp>>>(
    Api.CourseComment,
    {
      params
    }
  )
}

export function apiInsertCourseComment(data: insertCourseCommentReq) {
  return instance.post<insertCourseCommentReq, Result<saveResp>>(
    Api.CourseComment,
    data
  )
}

export function apiInsertLabComment(data: insertLabCommentReq) {
  return instance.post<insertLabCommentReq, Result<saveResp>>(
    Api.LabComment,
    data
  )
}

export function apiGetLabComment(params: getLabCommentReq) {
  return instance.get<Result<pageResp<getLabCommentResp>>>(Api.LabComment, {
    params
  })
}

export function apiDeleteCourseComment(params: deleteCourseCommentReq) {
  return instance.delete<Result>(Api.CourseComment, {
    params
  })
}

export function apiDeleteLabComment(params: deleteLabCommentReq) {
  return instance.delete<Result>(Api.LabComment, {
    params
  })
}
