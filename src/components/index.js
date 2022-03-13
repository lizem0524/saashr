// 全局自定义组件的注册
import PageTools from '@/components/PageTools'
import UploadExcel from '@/components/UploadExcel/'
export default {
  // Vue.use()会自动执行install函数，并传参一个Vue实例
  install(Vue) {
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
  }
}
