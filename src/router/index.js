import {createRouter, createWebHashHistory} from 'vue-router'
import routes from 'virtual:generated-pages'
import { setupLayouts } from 'virtual:generated-layouts'
import { useHead } from '@vueuse/head';

const router = createRouter({
  history: createWebHashHistory(),
  routes: setupLayouts(routes), // 自动应用 Layout
})

// 全局前置守卫：检查用户权限
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const isAuthenticated = userStore.isLoggedIn; // 判断用户是否登录

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login'); // 未登录则跳转到登录页
  } else {
    next();
  }
});

// 全局后置守卫：动态修改 title 和 meta
router.afterEach((to) => {
  useHead({
    title: to.meta.title || '默认标题',
    meta: [
      { name: 'description', content: to.meta.description || '默认描述' }
    ]
  });
});


export default router 