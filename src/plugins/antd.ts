import type { App } from 'vue'
import 'ant-design-vue/dist/antd.css'
import Antd from 'ant-design-vue'

export function setupAntd (app: App<Element>) {
  app.use(Antd)
}
