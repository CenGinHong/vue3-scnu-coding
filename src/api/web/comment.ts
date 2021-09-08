
import { saveResp, pageResp, Result } from '../common'
import {
  deleteCommentReq,
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
  LabComment = '/web/comment/lab'
}

export function apiGetCourseComment (params: getCourseCommentReq) {
  return instance.get<Result<pageResp<getCourseCommentResp>>>(Api.CourseComment, {
    params
  })
}

export function apiInsertCourseComment (data: insertCourseCommentReq) {
  return instance.post<Result<saveResp>>(Api.CourseComment, data)
}

export function apiInsertLabComment (data: insertLabCommentReq) {
  return instance.post<Result<saveResp>>(Api.LabComment, data)
}

export function apiGetLabComment (params: getLabCommentReq) {
  return instance.get<Result<pageResp<getLabCommentResp>>>(Api.LabComment, {
    params
  })
}

export function apiDeleteCourseComment (params: deleteCommentReq) {
  return instance.delete<Result>(Api.CourseComment, {
    params
  })
}

export function apiDeleteLabComment (params: deleteCommentReq) {
  return instance.delete<Result>(Api.LabComment, {
    params
  })
}
