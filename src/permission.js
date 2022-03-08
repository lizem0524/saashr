// 权限拦截路由跳转，导航守卫模块
import router from '@/router'
import store from '@/store'
// 导入进度条
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

// 定义不需要token就可以访问的白名单
const whiteList = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
  Nprogress.start() // 开启进度条
  if (store.getters.token) {
    if (to.path === '/login') {
      next('/')
    } else {
      // 只有放行时才获取用户资料
      // 只有没获取过才获取(userInfo中没有内容时)
      if (!store.getters.userId) {
        await store.dispatch('user/getUserInfo')
        console.log('发起了获取用户资料的请求')
      }
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
