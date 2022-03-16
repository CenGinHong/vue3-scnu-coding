import { createApp } from 'vue'
import App from './App.vue'
import { setGlobalOptions } from 'vue-request'
import { setupAntdV, setupVmd } from './plugins'
import { setupStore } from './store'
import { setupRouter } from './router'

setGlobalOptions({
  manual: true,
  loadingDelay: 200
})

const app = createApp(App)
setupAntdV(app)
setupRouter(app)
setupStore(app)
setupVmd(app)
app.mount('#app')
