import Vue from 'vue'
import App from './App'
import VueRoutre from 'vue-router'
import { ToastPlugin, AjaxPlugin } from 'vux'
import Index from './routers/index'
import Login from './routers/login'
import Reg from './routers/reg'
import Record from './routers/record'
import Transfer from './routers/transfer'
import Collect from './routers/collect'
import Ucenter from './routers/ucenter'
import Block from './routers/block'
import Qrscan from './routers/qrscan'
import plusReady from './plus/plusReady.js'
import goodTime from './plus/goodTime'

Vue.use(VueRoutre)
Vue.use(ToastPlugin)
Vue.use(AjaxPlugin)
Vue.use(plusReady)
Vue.filter('goodTime', function (timestamp) {
  return goodTime(timestamp)
})

const FastClick = require('fastclick')
FastClick.attach(document.body)

const router = new VueRoutre({
  routes: [
    {path: '/', name: 'index', component: Index, meta: {title: '星呗钱包', index: 3}},
    {path: '/login', name: 'login', component: Login, meta: {title: '登录', index: 1}},
    {path: '/reg', name: 'reg', component: Reg, meta: {title: '创建钱包账户', index: 2}},
    {path: '/record', name: 'record', component: Record, meta: {title: '交易记录', index: 5}},
    {path: '/transfer', name: 'transfer', component: Transfer, meta: {title: '资产转账', index: 5}},
    {path: '/collect', name: 'collect', component: Collect, meta: {title: '收款', index: 5}},
    {path: '/ucenter', name: 'ucenter', component: Ucenter, meta: {title: '我的', index: 4}},
    {path: '/block', name: 'block', component: Block, meta: {title: '区块详情', index: 5}},
    {path: '/qrscan', name: 'qrscan', component: Qrscan, meta: {title: '扫描二维码', index: 6}}
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
