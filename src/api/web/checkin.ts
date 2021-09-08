import {
  CheckinReq,
  CheckinStatusResp,
  DeleteCheckinRecordsReq,
  listCheckinDetailByCheckinRecordIdReq,
  GetCheckinDetailResp,
  GetCheckinRecordReq,
  ListCheckinRecordResp,
  GetCheckinStatusReq,
  InsertCheckinRecordReq,
  ListCheckinReq,
  StuListCheckInRecordResp,
  updateCheckinDetailReq
} from './model/checkinModel'
import { saveResp, pageResp, Result } from '../common'
import instance from '../../util/axios/axios'

enum Api {
  checkinStudent = '/web/checkin/student',
  checkinStatus = '/web/checkin/status',
  checkinDetail = '/web/checkin/detail',
  checkinRecord = '/web/checkin/record'
}

// 学生获取签到记录
export function ApiStuGetCheckinByCourseId (params: ListCheckinReq) {
  return instance.get<Result<pageResp<StuListCheckInRecordResp>>>(Api.checkinStudent, { params })
}

// 获取签到进行时状态
export function ApiGetCheckinStatus (params: GetCheckinStatusReq) {
  return instance.get<Result<CheckinStatusResp>>(Api.checkinStatus, { params })
}

// 进行签到
export function ApiCheckIn (data: CheckinReq) {
  return instance.post<Result>(Api.checkinStudent, data)
}

// 更新签到记录
export function apiUpdateCheckinDetailByCheckinDetailId (data: updateCheckinDetailReq) {
  return instance.put<Result>(Api.checkinDetail, data)
}

// 获取某记录的签到详情
export function apiListCheckinDetailByCheckinRecordId (params: listCheckinDetailByCheckinRecordIdReq) {
  return instance.get<Result<pageResp<GetCheckinDetailResp>>>(Api.checkinDetail, {
    params
  })
}

// 获取某课程的签到记录
export function apiListCheckinRecordByCourseId (params: GetCheckinRecordReq) {
  return instance.get<Result<pageResp<ListCheckinRecordResp>>>(Api.checkinRecord, {
    params
  })
}

// 插入签到
export function ApiInsertCheckinRecord (data: InsertCheckinRecordReq) {
  return instance.post<Result<saveResp>>(Api.checkinRecord, data)
}

export function ApiDeleteCheckinRecords (params: DeleteCheckinRecordsReq) {
  return instance.delete<Result>(Api.checkinRecord, {
    params
  })
}
