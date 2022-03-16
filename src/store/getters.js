const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token, // token的快捷访问
  name: state => state.user.userInfo.username, // 用户名的快捷访问
  userId: state => state.user.userInfo.userId, // 用户id的快捷访问
  staffPhoto: state => state.user.userInfo.staffPhoto, // 头像的快捷访问
  companyId: state => state.user.userInfo.companyId, // 公司id的快捷访问
  routes: state => state.permission.routes
}
export default getters
