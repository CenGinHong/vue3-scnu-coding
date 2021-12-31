import { Dayjs } from 'dayjs'

export interface listAllLabResp {
    labId: number
    courseId: number
    courseDetail: {
        userId: number
        courseName: string
    }
    type: number
    title: string
    content: string
    createdAt: Dayjs
    updatedAt: Dayjs
    attachmentSrc: string
    deadline?: Dayjs
}
