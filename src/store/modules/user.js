import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, getUserInfo } from '@/api/user'
const state = {
  token: getToken(), // 设置token为共享状态 初始化vuex时先从缓存中读取
  userInfo: {} // 定义空对象
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
  },
  // 更新用户基本信息对象
  setUserInfo(state, res) {
    state.userInfo = res
  },
  // 清除用户信息，退出登录使用
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
const actions = {
  // 发起登录请求
  // 因为响应拦截器已经去掉外层data并拦截错误的情况，下面可直接取到登录成功的数据
  async login(context, data) {
    const res = await login(data)
    // 提交响应回来的token给setToken
    context.commit('setToken', res)
  },
  // 发起获取用户信息的请求，数据通过mutations提交
  async getUserInfo(context) {
    const res = await getUserInfo()
    context.commit('setUserInfo', res)
    return res // 给后期做权限需要
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
