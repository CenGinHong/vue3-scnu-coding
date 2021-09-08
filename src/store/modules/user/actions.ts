import { IStore } from '../../types'
import { IUserState } from './state'
import { ActionContext } from 'vuex'
import { useRequest } from 'vue-request'
import { apiGetUserInfo } from '../../../api/web/user'

export const actions = {
  async getUserInfo ({ commit }: ActionContext<IUserState, IStore>) {
    const { data, run } = useRequest(apiGetUserInfo, {
      formatResult: (res) => {
        return res.data.result
      }
    })
    await run()
    commit('setUserInfo', data.value)
  }
}
