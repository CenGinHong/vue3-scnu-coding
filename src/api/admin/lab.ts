import instance from '../../util/axios/axios'
import {pageParams, pageResp, Result} from '../common'
import { listAllLabResp } from './model/labModel'

enum Api {
    listAllLab = '/admin/lab'
}

export function apiListAllLab(params: pageParams) {
  return instance.get<Result<pageResp<listAllLabResp>>>(Api.listAllLab, { params })
}
