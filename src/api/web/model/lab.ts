import { IFileItem, pageParams } from '../../common'
import { Dayjs } from 'dayjs'

export interface updateLabReq {
  labId: number
  title: string
  content: string
  isRemoveFile: boolean
  attachmentSrc?: string
  deadline: Dayjs | null
}

export interface insertLabReq {
  title: string
  content: string
  courseId: number
  deadline: Dayjs | null
}

export interface listLabByCourseIdReq extends pageParams {
  courseId: number
}

export interface labDetailResp {
  labId: number
  courseDetail?: {
    courseId: number
    courseName: string
  }
  labSubmitDetail: {
    labSubmitId: number
    report: string
    isFinish: boolean
    score: number
    labSubmitComment: number
  }
  title: string
  content: string
  attachmentSrc: string
  type: number
  deadline: string
  createdAt: string
  updatedAt: string
  fileList: IFileItem[]
}

export interface deleteLabReq {
  labId: number
}

export interface ListOneStudentScoreReq {
  userId: number
  courseId: number
}

export interface ListOneStudentScoreResp {
  title: string
  labSubmitDetail: {
    labSubmitId: number
    score: number
  }
}

export interface ListLabIdReq {
  courseId: number
}
