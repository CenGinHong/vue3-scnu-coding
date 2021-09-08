import {pageParams} from '../../common'
import {Moment} from 'moment'
import {apiGetIsCourseOpenByTeacher} from '../course'

export interface listCourseResp {
  courseId: number
  teacherDetail?: {
    userId: number
    username: string
  }
  courseName: string
  courseDes: string
  coverFileDetail?: {
    url: string
  }
  isClose: boolean
  createdAt: Moment
  updatedAt: Moment
}

export interface courseDetailResp {
  courseId: number
  teacherDetail?: {
    userId: number
    username: string
    avatarFileDetail?: {
      url: string
    }
    organization: string
    email: string
    major: string
  }
  courseName: string
  courseDes: string
  coverFileDetail?: {
    url: string
  }
  secretKey: string
  isClose: boolean
  languageType: number
  createdAt: string
  updatedAt: string
}

export interface searchCourseResp extends listCourseResp {
  isTakeDetail: {
    isTake: boolean,
  }
}

export interface searchCourseReq extends pageParams {
  courseNameOrTeacherName?: string,
}

export interface listCourseStudentReq extends pageParams {
  courseId: number
}

export interface listCourseStudentOverviewResp {
  userDetail: {
    userId: number
    email: string
    grade: number
    school: string
    userNum: string
    username: string
  }
  avgScoreDetail: {
    score: number
  }
  checkinDetail: {
    checkinCount: number
    totalCount: number
  }
  codingTimeDetail: {
    codingTime: number
  }
}

export interface getIsCourseEnrollReq {
  courseId: number
}

export interface getIsCourseEnrollResp {
  isEnroll: boolean
}

export interface insertCourseReq {
  courseName: string
  courseDes: string
  coverFileId?: number
  secretKey: string
  languageType: number
}

export interface updateCourseReq {
  courseId: number
  courseName: string
  courseDes: string
  coverFileId?: number
  secretKey: string
}

export interface getIsCourseOpenByTeacherReq {
  courseId: number
}

export interface getIsCourseOpenByTeacherResp {
  isOpen: boolean
}

export interface insertStudent2ClassReq {
  studentNums: string[]
  courseId: number
}

export interface insertStudent2ClassResp {
  successRecords: {
    userId: number
    email: string
    userNum: string
    username: string
    grade: number
    school: string
    gender: 0 | 1 | 2
    major: string
    organization: string
  },
  errorStudentNums: string[]
}

export interface removeFromClassReq {
  userIds: number[]
  courseId: number
}
