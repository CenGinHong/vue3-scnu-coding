import type { App } from 'vue'
import 'ant-design-vue/dist/antd.css'
import '@ant-design-vue/pro-layout/dist/style.css'
import Antd from 'ant-design-vue'
import ProLayout, { PageContainer } from '@ant-design-vue/pro-layout'

export function setupAntd(app: App<Element>) {
  app.use(Antd).use(ProLayout).use(PageContainer)
}
