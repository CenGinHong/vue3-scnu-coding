import { IUserState } from './state'

export const getters = {
  token: (state: IUserState) => state.token,
  userInfo: (state: IUserState) => state.userInfo
}
