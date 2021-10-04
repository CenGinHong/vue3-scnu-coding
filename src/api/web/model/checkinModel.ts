import { pageParams } from '../../common'

export interface listCheckinReq extends pageParams {
  courseId: number
}

export interface stuListCheckInRecordResp {
  checkinRecordId: number
  checkinName: string
  checkinDetail: {
    isCheckin: boolean
  }
  createdAt: string
}

// 获取正在签到的状态
export interface getCheckinStatusReq {
  courseId: number
}

// 获取正在签到的状态
export interface checkinStatusResp {
  checkinName: string
  totalDuration: number
  remainDuration: number
}

// 学生进行签到
export interface checkinReq {
  courseId: number
  checkinKey: string
}

// 获取学生的签到详情
export interface listCheckinDetailByCheckinRecordIdReq extends pageParams {
  checkinRecordId: number
}

export interface getCheckinDetailResp {
  userId: number
  userDetail?: {
    userNum: string
    username: string
  }
  checkinDetail?: {
    checkinDetailId: number
    isCheckin: boolean
  }
}

export interface getCheckinRecordReq extends pageParams {
  courseId: number
}

// 教师更新学生的签到情况
export interface updateCheckinDetailReq {
  checkinDetailId: number
  isCheckin: boolean
}

export interface listCheckinRecordResp {
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

export interface insertCheckinRecordReq {
  checkinName: string
  checkinKey: string
  duration: number
  courseId: number
}

export interface deleteCheckinRecordsReq {
  checkinRecordIds: number[]
}

export interface exportCsvReq {
  courseId: number
}
