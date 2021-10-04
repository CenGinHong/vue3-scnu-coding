import { App, InjectionKey } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'
import { IStore } from './types'
import user from './modules/user'
import createPersistedState from 'vuex-persistedstate'
export const key: InjectionKey<Store<IStore>> = Symbol('')

const store = createStore<IStore>({
  modules: {
    user: user
  },
  plugins: [createPersistedState()]
})

// 定义你自己的“useStore”组合函数
export function useStore() {
  return baseUseStore(key)
}

export function setupStore(app: App) {
  app.use(store, key)
}

export default store
