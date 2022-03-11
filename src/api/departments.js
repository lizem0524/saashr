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
// 新增部门的api
export function addDepartments(data) {
  return request({
    method: 'post',
    url: '/company/department',
    data
  })
}

// 根据id获取部门详情信息的api
export function getDepartDetail(id) {
  return request({
    url: '/company/department/' + id
  })
}

// 编辑部门的api
export function updateDepartments(data) {
  return request({
    method: 'put',
    url: '/company/department/' + data.id,
    data
  })
}

