import instance from '../../util/axios/axios'
import { pageParams, pageResp, Result } from '../common'
import {listLabSubmitByLabIdReq, listLabSubmitByLabIdResp} from './model/labSubmitModel'
enum Api {
    listLabSubmitByLabId = '/admin/submit'
}

export function apiListLabSubmitByLabId(params: listLabSubmitByLabIdReq) {
  return instance.get<Result<pageResp<listLabSubmitByLabIdResp>>>(Api.listLabSubmitByLabId, {
    params
  })
}
