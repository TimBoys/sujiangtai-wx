// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/store'
import axios from "axios";
import { XButton,Group,Cell,XImg,XDialog,Checker, CheckerItem,Confirm,XInput,InlineXNumber   } from 'vux'
import VueI18n from 'vue-i18n';
import messages from './i18n/i18n';
import localLang from './i18n/localeLang';
import VueLazyload from 'vue-lazyload';
import './assets/font/iconfont.css';

//配置axios
//axios.defaults.headers.get['Content-Type'] = 'application/json';
Vue.prototype.$http = axios;

//配置vux
Vue.component('x-button', XButton);
Vue.component('group', Group);
Vue.component('cell', Cell);
Vue.component("x-dialog",XDialog);
Vue.component('checker', Checker);
Vue.component('checker-item', CheckerItem);
Vue.component('confirm', Confirm)
Vue.component('x-input', XInput)
Vue.component('inline-x-number', InlineXNumber)




//配置i18n
Vue.use(VueI18n);

const i18n = new VueI18n({
    locale: localLang.localLang, // 语言标识
    messages
})

//配置懒加载
Vue.use(VueLazyload)
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: '',
  loading: '',
  attempt: 1
})

Vue.config.productionTip = false
// hack for active mobile
document.addEventListener("touchstart", function(){}, true)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  components: { App },
  template: '<App/>'
})
