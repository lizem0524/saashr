import store from '@/store'
export default {
  methods: {
    checkPermission(key) {
      // 拿到用户的点击权限数组
      const points = store.state.user.userInfo.roles.points
      if (points && points.length) {
        return points.some(item => item === key)
      }
      return false // 没权限
    }
  }
}
