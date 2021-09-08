import { IUserState, IUserInfo } from './state'
import { getUserInfoResp } from '../../../api/web/model/userModel'

export const mutations = {
  setToken: (state: IUserState, token: string) => {
    state.token = token
  },
  setUserInfo: (state: IUserState, userInfo: getUserInfoResp) => {
    state.userInfo = {
      userId: userInfo.userId,
      username: userInfo.username,
      avatarUrl: userInfo.avatarUrl,
      roleId: userInfo.roleId
    }
  }
}
