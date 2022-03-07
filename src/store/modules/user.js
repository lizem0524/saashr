import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'
const state = {
  token: getToken() // 设置token为共享状态 初始化vuex时先从缓存中读取
}
const mutations = {
  // 更新内存和cookies的token
  setToken(state, token) {
    state.token = token
    setToken(token) // 同步到cookies
  },
  // 清除内存和cookies的token
  removeToken(state) {
    state.token = null
    removeToken() // 同步到cookies
  }
}
const actions = {
  // 发起登录请求
  // 因为响应拦截器已经去掉外层data并拦截错误的情况，下面可直接取到登录成功的数据
  async login(context, data) {
    const res = await login(data)
    // 提交响应回来的token给setToken
    context.commit('setToken', res)
    console.log(res)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
