import { openIdeReq, openIdeResp } from './model/ideModel'
import instance from '../../util/axios/axios'
import { Result } from '../common'

enum Api {
  OpenIde = '/web/ide',
}

export function OpenIDE(data: openIdeReq) {
  return instance.post<openIdeReq, Result<openIdeResp>>(Api.OpenIde, data)
}
