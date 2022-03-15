import { Dayjs } from 'dayjs'
import { pageParams } from '../../common'

export interface listCourseResp {
    courseId: number
    userId: number
    teacherDetail?: {
        username: string
    }
    courseName: string
    courseDes: string
    coverImg: string
    secretKey: string
    isClose: boolean
    languageType: number
    updatedAt: Dayjs
}

export interface updateCourseReq {
    courseId: number
    courseName: string
    courseDes: string
    coverImg?: string
    secretKey: string
    isClose: boolean
    languageType: number
}

export interface listCourseEnrollResp {
    userId: number
    userDetail: {
        email: string
        userNum: string
        username: string
        major: string
        organization: string
    }
}

export interface listCourseEnrollReq extends pageParams {
    courseId: number
}

export interface removeCourseEnroll {
    courseId: number
    userIds: (number | string) []
}

export interface addStudent2Class {
    courseId: number
    studentNums: string[]
}

//
// export interface courseDetailResp {
//   courseId: number
//   teacherDetail?: {
//     userId: number
//     username: string
//     avatarImg: string
//     organization: string
//     email: string
//     major: string
//   }
//   courseName: string
//   courseDes: string
//   coverImg: string
//   secretKey: string
//   isClose: boolean
//   languageType: number
//   createdAt: string
//   updatedAt: string
// }
//
// export interface searchCourseResp extends listCourseResp {
//   isTakeDetail: {
//     isTake: boolean
//   }
// }
//
// export interface searchCourseReq extends pageParams {
//   courseNameOrTeacherName?: string
// }
//
// export interface listCourseStudentReq extends pageParams {
//   courseId: number
// }
//
// export interface listCourseStudentOverviewResp {
//   userDetail: {
//     userId: number
//     email: string
//     grade: number
//     school: string
//     userNum: string
//     username: string
//   }
//   avgScoreDetail: {
//     score: number
//   }
//   checkinDetail: {
//     checkinCount: number
//     totalCount: number
//   }
//   codingTimeDetail: {
//     codingTime: number
//   }
// }
//
// export interface getIsCourseEnrollReq {
//   courseId: number
// }
//
// export interface getIsCourseEnrollResp {
//   isEnroll: boolean
// }
//
// export interface updateCourseReq {
//   courseId: number
//   courseName: string
//   courseDes: string
//   coverImg?: string
//   secretKey: string
//   isClose: boolean
// }
//
// export interface createCourseReq {
//   courseName: string
//   courseDes: string
//   coverImg: string
//   secretKey: string
//   languageType: number
// }
//
// export interface getIsCourseOpenByTeacherReq {
//   courseId: number
// }
//
// export interface getIsCourseOpenByTeacherResp {
//   isOpen: boolean
// }
//
// export interface insertStudent2ClassReq {
//   studentNums: string[]
//   courseId: number
// }
//
// export interface insertStudent2ClassResp {
//   successRecords: {
//     userId: number
//     email: string
//     userNum: string
//     username: string
//     grade: number
//     school: string
//     gender: 0 | 1 | 2
//     major: string
//     organization: string
//   }
//   errorStudentNums: string[]
// }
//
// export interface removeFromClassReq {
//   userIds: number[]
//   courseId: number
// }
