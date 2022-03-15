import { pageParams } from '../../common'

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
  userId: number
  userDetail: {
    username: string
    userNum: string
  }
  labSubmitDetail?: {
    labSubmitId: number
    isFinish: boolean
    score: number
    labSubmitComment: string
    updatedAt: string
  }
  isIDERunning: boolean
}

// export interface listLabSubmitIdResp {
//   userId: number
//   userDetail: {
//     username: string
//     userNum: string
//   },
//   labSubmitDetail?: {
//     comment: string
//     score: number
//   }
// }

export interface listLabSubmitReq extends pageParams {
  labId: number
}

export type getLabSubmitIdReq = listLabSubmitReq

export interface correctLabReq {
  score: number
  comment: string
  userId: number
  labId: number
}

export interface exportScoreReq {
  courseId: number
  labIds: string[]
}
