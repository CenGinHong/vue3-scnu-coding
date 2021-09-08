import {
  codingTime,
  getCodingTimeResp,
  isEmailUsedReq,
  isUsedResp,
  isUserNumUsedReq, loginReq, loginResp,
  testData,
  getUserInfoResp, resetPasswordReq, updateUserInfoReq
} from './model/userModel'
import instance from '../../util/axios/axios'
import { Result, saveResp } from '../common'
import Login from '../../views/common/Login.vue'

enum Api {
  login = '/login',
  getCodingTime = '/web/user/coding_time',
  userInfo = '/web/user/myself',
  isEmailUsed = '/web/user/is-used/email',
  isUserNumUsed = '/web/user/is-used/userNum',
  resetPassword= '/wen/user/reset-password'
}

export function apiGetCodingTime (params?: getCodingTimeResp) {
  return instance.get<Result<codingTime>>(Api.getCodingTime, {
    params
  })
}

export function apiGetUserInfo () {
  return instance.get<Result<getUserInfoResp>>(Api.userInfo)
}

export function apiIsEmailUsed (params: isEmailUsedReq) {
  return instance.get<Result<isUsedResp>>(Api.isEmailUsed, {
    params
  })
}

export function apiIsUserNumUsed (params: isUserNumUsedReq) {
  return instance.get<Result<isUsedResp>>(Api.isUserNumUsed, {
    params
  })
}

export function apiUpdateUserInfo(data: updateUserInfoReq) {
  return instance.put<Result>(Api.userInfo,data)
}

export function apiTest (data:testData) {
  return instance.post<Result>('/test', data)
}

export function apiLogin (data: loginReq) {
  return instance.post<Result<loginResp>>(Api.login, data)
}

export function apiResetPassword (data: resetPasswordReq) {
  return instance.put<Result>(Api.resetPassword, data)
}
