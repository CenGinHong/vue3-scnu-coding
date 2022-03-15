import {
  codingTime,
  getCodingTimeResp,
  getUserInfoResp,
  isEmailUsedReq,
  isUsedResp,
  isUserNumUsedReq,
  loginReq,
  loginResp,
  resetPasswordReq,
  testData,
  updateUserInfoReq
} from './model/userModel'
import instance from '../../util/axios/axios'
import { Result } from '../common'

enum Api {
  login = '/login',
  logout = '/logout',
  getCodingTime = '/web/user/coding-time',
  userInfo = '/web/user/myself',
  isEmailUsed = '/web/user/is-used/email',
  isUserNumUsed = '/web/user/is-used/userNum',
  resetPassword = '/wen/user/reset-password',
}

export function apiGetCodingTime(params: getCodingTimeResp) {
  return instance.get<Result<codingTime[]>>(Api.getCodingTime, {
    params
  })
}

export function apiGetUserInfo() {
  return instance.get<Result<getUserInfoResp>>(Api.userInfo)
}

export function apiIsEmailUsed(params: isEmailUsedReq) {
  return instance.get<Result<isUsedResp>>(Api.isEmailUsed, {
    params
  })
}

export function apiIsUserNumUsed(params: isUserNumUsedReq) {
  return instance.get<Result<isUsedResp>>(Api.isUserNumUsed, {
    params
  })
}

export function apiUpdateUserInfo(data: updateUserInfoReq) {
  return instance.put<updateUserInfoReq, Result>(Api.userInfo, data)
}

export function apiTest(data: testData) {
  return instance.post<testData, Result>('/test', data)
}

export function apiLogin(data: loginReq) {
  return instance.post<loginReq, Result<loginResp>>(Api.login, data)
}

export function apiLogout() {
  return instance.post(Api.logout)
}

export function apiResetPassword(data: resetPasswordReq) {
  return instance.put<resetPasswordReq, Result>(Api.resetPassword, data)
}
