import Vue from 'vue'
import App from './App.vue'
// 引入路由模块
import router from "@/router/index.js"
import store from "@/store/index.js"

Vue.config.productionTip = false

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)
import {url} from '@/utils/http'


Vue.prototype.$url = url

import dayjs from "dayjs"
Vue.prototype.$dayjs = dayjs;

new Vue({
  // 挂载router
  router,
  store,
  render: h => h(App),
}).$mount('#app')