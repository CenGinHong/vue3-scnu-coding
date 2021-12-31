import { pageResp, Result, saveResp } from '../common'
import {
  deleteLabReq,
  insertLabReq,
  labDetailResp,
  listLabByCourseIdReq,
  ListOneStudentScoreReq,
  ListOneStudentScoreResp,
  updateLabReq
} from './model/lab'
import instance from '../../util/axios/axios'

enum Api {
  lab = '/web/lab',
  score = '/web/lab/score',
}

export function apiListLabByCourseId(params: listLabByCourseIdReq) {
  return instance.get<Result<pageResp<labDetailResp>>>(Api.lab, {
    params: params
  })
}

export function apiDeleteLab(id: number) {
  return instance.delete<Result>(Api.lab + '/' + id)
}

export function apiUpdateLab(data: updateLabReq) {
  return instance.put<updateLabReq, Result>(Api.lab, data)
}

export function apiInsertLab(data: insertLabReq) {
  return instance.post<insertLabReq, Result<saveResp>>(Api.lab, data)
}

export function apiListOneStudentScoreResp(params: ListOneStudentScoreReq) {
  return instance.get<Result<pageResp<ListOneStudentScoreResp>>>(Api.score, {
    params: params
  })
}

export function apiGetLabDetail(id: number) {
  return instance.get<Result<labDetailResp>>(Api.lab + '/' + id)
}
