import { IAsyncRouteState } from './modules/async-route'
import { IUserState } from './modules/user/state'
import { IComment } from './modules/comment'

export interface IStore {
  asyncRoute: IAsyncRouteState
  user: IUserState
  comment: IComment
}
