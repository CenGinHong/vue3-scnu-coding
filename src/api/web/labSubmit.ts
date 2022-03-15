import {
  correctLabReq,
  exportScoreReq,
  getLabCodeReq,
  getLabCodeResp,
  getReportContentReq,
  getReportContentResp,
  listLabSubmitReq,
  listLabSubmitResp,
  updateFinishTagReq,
  updateReportContentReq
} from './model/labSubmit'
import { pageResp, Result } from '../common'
import instance from '../../util/axios/axios'

enum Api {
  updateLabFinish = '/web/submit/finish',
  reportContent = '/web/submit/report',
  labCode = '/web/submit/code',
  labSubmit = '/web/submit',
  labSubmitId = '/web/submit/id',
  correct = '/web/submit/correct',
  exportScore = '/web/submit/export',
}

// 改变提交状态
export function apiChangeLabFinish(data: updateFinishTagReq) {
  return instance.put<updateFinishTagReq, Result>(Api.updateLabFinish, data)
}

// 教师批改获取代码和实验报告
export function apiGetLabCode(params: getLabCodeReq) {
  return instance.get<Result<getLabCodeResp>>(Api.labCode, {
    params
  })
}

export function apiGetReportContent(params: getReportContentReq) {
  return instance.get<Result<getReportContentResp>>(Api.reportContent, {
    params
  })
}

// 更新实验报告内容
export function apiUpdateReportContent(data: updateReportContentReq) {
  return instance.put<updateReportContentReq, Result>(Api.reportContent, data)
}

// 获取实验提交列表
export function apiListLabSubmit(params: listLabSubmitReq) {
  return instance.get<Result<pageResp<listLabSubmitResp>>>(Api.labSubmit, {
    params
  })
}

// 获取实验提交学生信息列表
// export function apiListLabSubmitId (params: listLabSubmitReq) {
//   return instance.get<Result<listLabSubmitIdResp[]>>(Api.labSubmitId, {
//     params
//   })
// }

export function apiCorrect(data: correctLabReq) {
  return instance.post<correctLabReq, Result>(Api.labSubmit, data)
}

export function apiExportScore(params: exportScoreReq) {
  return instance.get(Api.exportScore, {
    params,
    responseType: 'blob'
  })
}
