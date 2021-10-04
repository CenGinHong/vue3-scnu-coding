import { IFileItem, pageParams } from '../../common'
import { Dayjs } from 'dayjs'

export interface updateLabReq {
  labId: number
  title: string
  content: string
  attachmentSrc?: string
  deadline: Dayjs | null
}

export interface insertLabReq {
  title: string
  content: string
  attachmentSrc: string
  courseId: string
  deadline?: Dayjs
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
  title: string
  content: string
  attachmentSrc: string
  type: number
  deadline: Dayjs | null
  createdAt: Dayjs
  updatedAt: Dayjs
  fileList: IFileItem[]
}

export interface deleteLabReq {
  labId: number
}

export interface ListOneStudentScoreReq {
  studentId: number
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
