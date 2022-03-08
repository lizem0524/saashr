import request from '@/utils/request'
export function login(data) {
  return request({
    method: 'POST',
    url: '/sys/login',
    data
  })
}

export function getUserInfo() {
  return request({
    method: 'POST',
    url: '/sys/profile'
  })
}

// 根据用户id获取用户的详情
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}
export function logout() {}
