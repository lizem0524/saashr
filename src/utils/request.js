import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import { getTimeStamp } from '@/utils/auth.js'
import router from '@/router'
// 定义token超时事件
const TimeOut = 50000
const service = axios.create({
  // 执行npm run dev => .evn.development => api =>跨域代理
  baseURL: process.env.VUE_APP_BASE_API, // npm run build => /prod-api
  timeout: 5000
})
// 请求拦截器
service.interceptors.request.use(
  request => {
    // 注入token
    if (store.getters.token) {
      if (CheckTimeOut()) {
        store.dispatch('user/logout')
        router.push('/login')
        // 为什么会在响应拦截器的error中接收？
        return Promise.reject(new Error('登录超时，请重新登录'))
      } else {
        request.headers['Authorization'] = `Bearer ${store.getters.token}`
      }
    }
    return request // 必须返回
  },
  error => {
    Message.error(error.message)
    return Promise.reject(error.message)
  }
)
// 响应拦截器
service.interceptors.response.use(
  // 有数据返回
  response => {
    // axios默认加了一层data
    const { success, message, data } = response.data
    // 根据success的成功与否决定下面的操作
    if (success) {
      return data // 必须返回
    } else {
      // 返回失败的数据
      Message.error(message)
      return Promise.reject(new Error(message))
    }
  }, // 报错
  error => {
    // 当返回数据错误，且状态为10002时为token超时，登出
    if (error.response && error.response.data && error.response.data.code === 10002) {
      store.dispatch('user/logout')
      router.push('/login')
      return Promise.reject(new Error('登录超时，请重新登录'))
    } else {
      Message.error(error) // 提示错误信息
      return Promise.reject(error.message)
      // 返回执行错误，让当前的执行链跳出成功，直接进入catch
    }
  }
)
// 定义检查token是否超时的函数
function CheckTimeOut() {
  const nowTime = Date.now()
  const timeStamp = getTimeStamp()
  return (nowTime - timeStamp) / 1000 > TimeOut
}
export default service
