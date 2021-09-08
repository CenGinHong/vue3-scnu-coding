import { pageParams } from '../../common'

export interface ListCheckinReq extends pageParams {
  courseId: number
}

export interface StuListCheckInRecordResp {
  checkinRecordId: number
  checkinName: string
  checkinDetail: {
    isCheckin: boolean
  }
  createdAt: string
}

// 获取正在签到的状态
export interface GetCheckinStatusReq {
  courseId: number
}

// 获取正在签到的状态
export interface CheckinStatusResp {
  checkinName: string
  totalDuration: number
  remainDuration: number
}

// 学生进行签到
export interface CheckinReq {
  courseId: number
  checkinKey: string
}

// 获取学生的签到详情
export interface listCheckinDetailByCheckinRecordIdReq extends pageParams {
  checkinRecordId: number
}

export interface GetCheckinDetailResp {
  userId: number,
  userDetail?: {
    userNum: string,
    username: string
  }
  checkinDetail? :{
    checkinDetailId: number
    isCheckin: boolean
  }
}

export interface GetCheckinRecordReq extends pageParams {
  courseId: number
}

// 教师更新学生的签到情况
export interface updateCheckinDetailReq {
  checkinDetailId: number
  isCheckin: boolean
}

export interface ListCheckinRecordResp {
  checkinRecordId: number
  checkinName: string
  checkinKey: string
  totalDuration: number
  createdAt: string
  attendance: {
    checkinCount: number
    takeCount: number
  }
}

export interface InsertCheckinRecordReq {
  checkinName: string,
  checkinKey: string,
  duration: number
  courseId:number
}

export interface DeleteCheckinRecordsReq {
  checkinRecordIds: number[]
}
