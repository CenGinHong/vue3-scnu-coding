import instance from '../../util/axios/axios'
import { pageResp, Result } from '../common'
import {listIDEReq, listIDEResp, removeContainerReq, restartContainerReq, serverInfoResp} from './model/IDEModel'

enum Api {
    IDE = '/admin/ide',
  SERVER = '/admin/ide/server'
}

export function apiListAllIDE(params: listIDEReq) {
  return instance.get<Result<pageResp<listIDEResp>>>(Api.IDE, {
    params
  })
}

export function apiRestartIDE(data: restartContainerReq) {
  return instance.put(Api.IDE, data)
}

export function apiRemoveIDE(params: removeContainerReq) {
  return instance.delete(Api.IDE, {
    params
  })
}

export function apiListServerInfo() {
  return instance.get<Result<serverInfoResp>>(Api.SERVER)
}
