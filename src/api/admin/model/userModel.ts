import { Dayjs } from "dayjs";
import { RoleEnum } from "../../../enums/roleEnum";
import { pageParams } from "../../common";

export interface listUserReq extends pageParams{
    role: RoleEnum
}

export interface listUserResp {
    userId: number
    email: string
    userNum: string
    username: string
    gender: 0 | 1 | 2
    major: string
    school: string
    organization: string
    grade: number
    createdAt: Dayjs
}
