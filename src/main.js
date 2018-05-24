import Vue from 'vue'
import App from './App'
import VueRoutre from 'vue-router'
import { ToastPlugin, AjaxPlugin, TransferDom } from 'vux'
import Index from './routers/index'
import Login from './routers/login'
import Reg from './routers/reg'
import plusReady from './plus/plusReady.js'

Vue.use(VueRoutre)
Vue.use(ToastPlugin)
Vue.use(AjaxPlugin)
Vue.use(plusReady)
Vue.directive('transfer-dom', TransferDom)

const FastClick = require('fastclick')
FastClick.attach(document.body)

const router = new VueRoutre({
  routes: [
    {path: '/', name: 'index', component: Index, meta: {title: '星呗钱包', index: 3}},
    {path: '/login', name: 'login', component: Login, meta: {title: '登录', index: 1}},
    {path: '/reg', name: 'reg', component: Reg, meta: {title: '创建钱包账户', index: 2}}
  ]
})
router.beforeEach((route, redirect, next) => {
  document.title = route.meta.title
  next()
})

/* eslint-disable */
const app = new Vue({
  router: router,
  render: v => v(App)
}).$mount('#app')
