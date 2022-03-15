import Layout from '@/layout'
export default {
  path: '/employees', // 路由地址
  name: 'employees', // name属性后期做权限用到
  component: Layout, // 用Layout的原因是员工路由和主页路由是并列关系
  children: [
    {
      path: '', // 二级路由默认展示组件
      component: () => import ('@/views/employees'),
      meta: {
        title: '员工管理', // sideBar读取该属性给左侧按钮命名
        icon: 'people'
      }
    },
    { path: 'detail/:id', // 动态路由
      component: () => import('@/views/employees/detail.vue'),
      hidden: true,
      meta: {
        title: '员工详情'
      }
    },
    { path: 'print/:id',
      component: () => import('@/views/employees/print.vue'),
      hidden: true,
      meta: {
        title: '员工信息打印'
      }
    }
  ]
}
