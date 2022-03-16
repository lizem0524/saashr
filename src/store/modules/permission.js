import { constantRoutes, asyncRoutes } from '@/router'
const state = {
  routes: constantRoutes// 路由表 标识当前用户所拥有的所有路由的数组
}
const mutations = {
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  filterRoutes(context, menus) {
    // 筛选动态路由，拿到用户权限列表中有的
    const newRoutes = asyncRoutes.filter(item => menus.some(key => key === item.name))
    // 赋值state中的routes
    console.log(newRoutes)
    context.commit('setRoutes', newRoutes)
    return newRoutes // state数据是为了控制左侧菜单，return是给addRoutes
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
