import { sendVerCodeReq } from './model/common'
import instance from '../../util/axios/axios'

enum Api {
  login = '/login',
  sendVerCode = '/common/verCode'
}

export function apiSendVerCode (data:sendVerCodeReq) {
  return instance.post(Api.sendVerCode, data)
}
