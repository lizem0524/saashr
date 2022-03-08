import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
const service = axios.create({
  // 执行npm run dev => .evn.development => api =>跨域代理
  baseURL: process.env.VUE_APP_BASE_API, // npm run build => /prod-api
  timeout: 5000
})
// 请求拦截器
service.interceptors.request.use(
  config => {
    // 注入token
    if (store.getters.token) {
      config.headers['Authorization'] = `Bearer ${store.getters.token}`
    }
    return config // 必须返回
  },
  error => {
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
    Message.error(error.message) // 提示错误信息
    return Promise.reject(error) // 返回执行错误，让当前的执行链跳出成功，直接进入catch
  }
)
export default service
