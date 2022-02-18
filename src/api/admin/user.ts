import instance from '../../util/axios/axios'
import { pageResp, Result } from '../common'
import { getUserResp, listUserReq, listUserResp, updateUserReq } from './model/userModel'

enum Api {
  listAllStudent = '/admin/user/student',
  getImportDemo = '/admin/user/import/demo',
  importStudent = '/admin/user/import',
  resetPassword = '/admin/user/password',
  getUser = '/admin/user'
}

export function apiListUser(params: listUserReq) {
  return instance.get<Result<pageResp<listUserResp>>>(Api.listAllStudent, {
    params
  })
}

export function apiGetImportDemo() {
  return instance.get(Api.getImportDemo)
}

export function apiImportStudent(data: FormData) {
  return instance.post(Api.importStudent, data, {
    headers: {
      'Content-Type': ':multipart/form-data'
    }
  })
}

export function apiGetUser(id: number) {
  return instance.get<Result<getUserResp>>(Api.getUser + '/' + id)
}

export function apiUpdateUser(data: updateUserReq) {
  return instance.put<updateUserReq>(Api.getUser, data)
}

export function apiResetPassword(userId: number) {
  return instance.put(Api.resetPassword + '/' + userId)
}

export function apiDeleteUser(userId: number) {
  return instance.delete(Api.getUser+ '/' + userId)
}
