import {
  checkinReq,
  checkinStatusResp,
  exportCsvReq,
  getCheckinDetailResp,
  getCheckinRecordReq,
  getCheckinStatusReq,
  insertCheckinRecordReq,
  listCheckinDetailByCheckinRecordIdReq,
  listCheckinRecordResp,
  listCheckinReq,
  stuListCheckInRecordResp,
  updateCheckinDetailReq
} from './model/checkinModel'
import { pageResp, Result, saveResp } from '../common'
import instance from '../../util/axios/axios'

enum Api {
  checkinStudent = '/web/checkin/student',
  checkinStatus = '/web/checkin/status',
  checkinDetail = '/web/checkin/detail',
  checkinRecord = '/web/checkin/record',
  export = '/web/checkin/export',
}

// 学生获取签到记录
export function apiStuGetCheckinByCourseId(params: listCheckinReq) {
  return instance.get<Result<pageResp<stuListCheckInRecordResp>>>(
    Api.checkinStudent,
    { params }
  )
}

// 获取签到进行时状态
export function apiGetCheckinStatus(params: getCheckinStatusReq) {
  return instance.get<Result<checkinStatusResp>>(Api.checkinStatus, { params })
}

// 进行签到
export function apiCheckIn(data: checkinReq) {
  return instance.post<checkinReq, Result>(Api.checkinStudent, data)
}

// 更新签到记录
export function apiUpdateCheckinDetailByCheckinDetailId(
  data: updateCheckinDetailReq
) {
  return instance.put<updateCheckinDetailReq, Result>(Api.checkinDetail, data)
}

// 获取某记录的签到详情
export function apiListCheckinDetailByCheckinRecordId(
  params: listCheckinDetailByCheckinRecordIdReq
) {
  return instance.get<Result<pageResp<getCheckinDetailResp>>>(
    Api.checkinDetail,
    {
      params
    }
  )
}

// 获取某课程的签到记录
export function apiListCheckinRecordByCourseId(params: getCheckinRecordReq) {
  return instance.get<Result<pageResp<listCheckinRecordResp>>>(
    Api.checkinRecord,
    {
      params
    }
  )
}

// 插入签到
export function apiInsertCheckinRecord(data: insertCheckinRecordReq) {
  return instance.post<insertCheckinRecordReq, Result<saveResp>>(
    Api.checkinRecord,
    data
  )
}

export function apiDeleteCheckinRecords(id: number) {
  return instance.delete<Result>(Api.checkinRecord + '/' + id)
}

export function apiExportCsv(params: exportCsvReq) {
  return instance.get(Api.export, {
    params
  })
}
