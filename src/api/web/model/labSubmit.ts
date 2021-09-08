import { pageParams } from '../../common'
import { Moment } from 'moment'

export interface code {
  name: string // 文件名字
  content: string // 文件内容
  childNode: code[] // 文件
}

export interface updateFinishTagReq {
  userId?: number
  labId: number
  isFinish: boolean
}

export interface getLabCodeReq {
  labId: number
  userId?: number
}

export interface getLabCodeResp {
  code: code[]
}

export interface getReportContentReq {
  labId: number
  userId?: number
}

export interface getReportContentResp {
  reportContent: string
}

export interface updateReportContentReq {
  labId: number
  reportContent: string
}

export interface listLabSubmitResp {
  labSubmitId: number
  userDetail: {
    userId: number
    username: string
    userNum: string
  },
  isFinish: boolean
  score: number
  labSubmitComment: string
  updatedAt: Moment
}

export interface getLabSubmitReq extends pageParams {
  labId: number
}
