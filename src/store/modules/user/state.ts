import { RoleEnum } from '../../../enums/roleEnum'

export interface IUserInfo {
  userId: number
  username: string
  roleId: number
  avatarImg: string
}

export interface IUserState {
  token: string
  userInfo: IUserInfo
}

export const state: IUserState = {
  token: '',
  userInfo: {
    userId: 0,
    username: '',
    roleId: RoleEnum.NORMAL,
    avatarImg: ''
  }
}
