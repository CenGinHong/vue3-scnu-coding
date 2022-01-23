
import instance from '../../util/axios/axios'
import { pageParams, pageResp, Result } from '../common'
import { listUserReq, listUserResp } from './model/userModel'

enum Api {
    listAllStudent = '/admin/user/student'
}

export function apiListAllStudent(params: listUserReq) {
  return instance.get<Result<pageResp<listUserResp>>>(Api.listAllStudent, {
    params
  })
}
