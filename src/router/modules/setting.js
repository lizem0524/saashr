import Layout from '@/layout'
export default {
  path: '/setting', // 路由地址
  name: 'settings', // name属性后期做权限用到
  component: Layout, // 用Layout的原因是员工路由和主页路由是并列关系
  children: [{
    path: '', // 二级路由默认展示组件
    name: 'settings',
    component: () => import ('@/views/setting'),
    meta: {
      title: 'settings', // sideBar读取该属性给左侧按钮命名
      icon: 'setting'
    }
  }]
}
