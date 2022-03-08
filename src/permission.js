// 权限拦截路由跳转，导航守卫模块
import router from '@/router'
import store from '@/store'
// 导入进度条
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

// 定义不需要token就可以访问的白名单
const whiteList = ['/login', '/404']
router.beforeEach((to, from, next) => {
  Nprogress.start() // 开启进度条
  if (store.getters.token) {
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
    }
  }
})
Nprogress.done()
router.afterEach(() => {
  Nprogress.done() // 关闭进度条
})
