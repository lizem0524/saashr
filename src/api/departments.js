// 获取组织架构数据的api
import request from '@/utils/request'
export function getDepartments() {
  return request({
    url: '/company/department'
  })
}
// 根据id删除部门
export function delDepartments(id) {
  return request({
    method: 'delete',
    url: '/company/department/' + id
  })
}
export function addDepartments(data) {
  return request({
    method: 'post',
    url: '/company/department',
    data
  })
}
