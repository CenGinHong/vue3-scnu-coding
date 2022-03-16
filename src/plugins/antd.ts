import type { App } from 'vue'
import 'ant-design-vue/dist/antd.css'
import '@ant-design-vue/pro-layout/dist/style.css'
import Antd from 'ant-design-vue'
import ProLayout from '@ant-design-vue/pro-layout'

export function setupAntdV(app: App<Element>) {
  app.use(ProLayout)
}
