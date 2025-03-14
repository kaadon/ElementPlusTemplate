import {createRouter, createWebHashHistory} from 'vue-router'
import routes from 'virtual:generated-pages'
import { setupLayouts } from 'virtual:generated-layouts'

const router = createRouter({
  history: createWebHashHistory(),
  routes: setupLayouts(routes), // 自动应用 Layout
})

export default router 