
import { saveResp, pageResp, Result } from '../common'
import {
  deleteLabReq,
  getLabByCourseIdReq,
  labDetailResp,
  ListOneStudentScoreReq,
  ListOneStudentScoreResp,
  insertLab
} from './model/lab'
import instance from '../../util/axios/axios'

enum Api {
  lab = '/web/lab',
  score = '/web/lab/score'
}

export function apiListLabByCourseId (params: getLabByCourseIdReq) {
  return instance.get<Result<pageResp<labDetailResp>>>(Api.lab, {
    params: params
  })
}

export function apiDeleteLab (params: deleteLabReq) {
  return instance.delete<Result>(Api.lab, {
    params
  })
}

export function apiUpdateLab (data: insertLab) {
  return instance.patch<Result>(Api.lab, data)
}

export function apiInsertLab (data: insertLab) {
  return instance.post<Result<saveResp>>(Api.lab, data)
}

export function apiListOneStudentScoreResp (params: ListOneStudentScoreReq) {
  return instance.get<Result<pageResp<ListOneStudentScoreResp>>>(Api.score, {
    params: params
  })
}
