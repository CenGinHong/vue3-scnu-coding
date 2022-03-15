import { App } from 'vue'
import VMdEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/theme/style/github.css'
import '@kangc/v-md-editor/lib/style/preview.css'

// highlightjs
import hljs from 'highlight.js'
import hljsVuePlugin from '@highlightjs/vue-plugin'
import 'highlight.js/styles/atom-one-dark.css'
import 'highlight.js/lib/common'

VMdEditor.use(githubTheme, {
  Hljs: hljs
})

export function setupVmd(app: App<Element>) {
  app.use(VMdEditor).use(hljsVuePlugin)
}
