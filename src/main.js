import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import Components from '@/components'
import * as directives from '@/directives/'
import * as filters from '@/filters/'
import checkPermission from '@/mixin/checkPermission'
import i18n from '@/lang'
import '@/icons' // icon
import '@/permission' // permission control

// 循环对象，注册自定义指令
for (const key in directives) {
  Vue.directive(key, directives[key])
}
// 循环对象，注册全局过滤器
for (const key in filters) {
  Vue.filter(key, filters[key])
}

// set ElementUI lang to EN
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key)
})
// Vue.use(ElementUI)
Vue.use(Components)
Vue.mixin(checkPermission) // 所有组件的检查方法

Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
