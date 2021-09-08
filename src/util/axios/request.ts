import { useRequest } from 'vue-request'
import axios from 'axios'
import instance from './axios'
import Login from '../../../view/Login.vue'
import { LoginParams, LoginResp } from '../../api/admin/model/userModel'
import { RequestEnum } from '../../enums/httpEnum'

enum Api {
    login = '/web/login',
    logout = '/web/logout',
    getAllUser = '/admin/user'
}

const getUser = (params: LoginParams) => {
  return instance.get<LoginResp>(Api.login, {
    method: RequestEnum.POST,
    params: params
  })
}
