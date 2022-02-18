import { pageResp, Result, saveResp } from '../common'
import {
  insertLabReq,
  labDetailResp,
  listLabByCourseIdReq,
  updateLabReq
} from './model/lab'
import instance from '../../util/axios/axios'

enum Api {
    lab = '/web/lab',
}

export function apiListLabByCourseId(params: listLabByCourseIdReq) {
  return instance.get<Result<pageResp<labDetailResp>>>(Api.lab, {
    params: params
  })
}

export function apiDeleteLab(id: number) {
  return instance.delete<Result>(Api.lab + '/' + id)
}

export function apiUpdateLab(data: FormData) {
  return instance.put<updateLabReq, Result>(Api.lab, data, {
    headers: {
      'Content-Type': ':multipart/form-data'
    }
  })
}

export function apiInsertLab(data: FormData) {
  return instance.post<insertLabReq, Result<saveResp>>(Api.lab, data, {
    headers: {}
  })
}



export function apiGetLabDetail(id: number) {
  return instance.get<Result<labDetailResp>>(Api.lab + '/' + id)
}
