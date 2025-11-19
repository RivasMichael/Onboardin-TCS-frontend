import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  // Route guard: simple role-based checks for /admin and /dashboard
  Router.beforeEach(async (to, from, next) => {
    // lazy-load auth store and restore from localStorage if needed
    try {
      const { useAuthStore } = await import('src/stores/auth')
      const auth = useAuthStore()
      auth.loadFromStorage()

      const isAuth = auth.isAuthenticated

      if (to.path.startsWith('/admin')) {
        if (!isAuth) return next({ path: '/' })
        if (!auth.isAdmin) return next({ path: '/dashboard' })
        return next()
      }

      if (to.path.startsWith('/dashboard')) {
        if (!isAuth) return next({ path: '/' })
        return next()
      }

      return next()
    } catch {
      // If anything fails, allow navigation (fallback)
      return next()
    }
  })

  return Router
})
