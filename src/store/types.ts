import { IAsyncRouteState } from './modules/async-route'
import { IUserState } from './modules/user/state'

export interface IStore {
  asyncRoute: IAsyncRouteState
  user: IUserState
}
