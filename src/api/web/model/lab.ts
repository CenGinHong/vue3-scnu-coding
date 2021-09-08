import {pageParams, saveResp} from '../../common'
import {Moment} from 'moment'

export interface updateLab {
  labId: number
  title: string,
  content: string
  attachmentFileId?: number
  deadline?: Moment
}

export interface insertLab {
  title: string,
  content: string
  attachmentFileId?: number
  deadline?: Moment
}


export interface getLabByCourseIdReq extends pageParams {
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
  labSubmitDetail?: {
    isFinish: boolean
    score: number
    labSubmitComment: string
  }
  attachmentFileDetail?: {
    localFileId: number
    filename: string
    size: number
    url: string
    contentType: string
  }
  deadline?: Moment
  createdAt: Moment
  updatedAt: Moment
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
