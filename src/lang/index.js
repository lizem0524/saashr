import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookie from 'js-cookie'
import ElementZH from 'element-ui/lib/locale/lang/zh-CN'
import ElementEN from 'element-ui/lib/locale/lang/en'
import customZH from './zh'
import customEN from './en'
Vue.use(VueI18n)
export default new VueI18n({
  locale: Cookie.get('language') || 'en',
  messages: {
    en: { ...ElementEN, ...customEN },
    zh: { ...ElementZH, ...customZH }
  }
})
