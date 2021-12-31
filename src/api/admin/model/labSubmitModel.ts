import { Dayjs } from 'dayjs'
import { pageParams } from '../../common'

export interface listLabSubmitByLabIdReq extends pageParams{
    labId: number
}

export interface listLabSubmitByLabIdResp {
    userId: number
    userDetail: {
        username: string
        userNum: string
    }
    labSubmitDetail: {
        labSubmitId: number
        isFinish: boolean
        score: number
        labSubmitComment: string
        updatedAt: Dayjs
    }
}
