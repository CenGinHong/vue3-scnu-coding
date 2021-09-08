
import {
  updateFinishTagReq,
  getLabSubmitReq, listLabSubmitResp, getLabCodeReq,
  getLabCodeResp, getReportContentReq, getReportContentResp,
  updateReportContentReq
} from './model/labSubmit'
import { pageResp, Result } from '../common'
import instance from '../../util/axios/axios'

enum Api {
  updateLabFinish = '/web/submit/finish',
  reportContent = '/web/submit/report',
  labCode = '/web/submit/code',
  labSubmit = '/web/submit',
  labSubmitId = '/web/submitId',
}

// 改变提交状态
export function apiChangeLabFinish (data: updateFinishTagReq) {
  return instance.put<Result>(Api.updateLabFinish, data)
}

// 教师批改获取代码和实验报告
export function apiGetLabCode (params: getLabCodeReq) {
  return instance.get<Result<getLabCodeResp>>(Api.labCode, {
    params
  })
}

export function apiGetReportContent (params: getReportContentReq) {
  return instance.get<Result<getReportContentResp>>(Api.reportContent, {
    params
  })
}

// 更新实验报告内容
export function apiUpdateReportContent (data: updateReportContentReq) {
  return instance.put<Result>(Api.reportContent, data)
}


// 获取实验提交列表
export function apiListLabSubmit (params: getLabSubmitReq) {
  return instance.get<Result<listLabSubmitResp[]>>(Api.labSubmit, {
    params
  })
}
