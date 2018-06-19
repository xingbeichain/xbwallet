<template>
  <div class="index">
    <div class="header" v-bind:style="{paddingTop: paddings}">
      <div class="logo">
        <img src="../assets/images/indexlogo.png" style="vertical-align: middle">
        <span style="vertical-align: middle;color: #ffffff">星呗钱包</span>
        <div class="refresh" @click="refresh">
          <img src="../assets/images/refresh.png">
        </div>
      </div>
      <div class="money">{{xbc}}</div>
      <div class="xbc">总资产(XBC) ≈ ￥{{rmb}}</div>
    </div>
    <flexbox class="translate">
      <flexbox-item>
        <div class="transfer" @click="transfer">
          <img src="../assets/images/transfer.png" style="vertical-align: middle">
          <span style="vertical-align: middle">我要转账</span>
        </div>
      </flexbox-item>
      <flexbox-item>
        <div class="collect" @click="collect">
          <img src="../assets/images/Collect.png" style="vertical-align: middle">
          <span style="vertical-align: middle">我要收钱</span>
        </div>
      </flexbox-item>
    </flexbox>
    <div class="record">
      <span class="recordtitle">交易记录<span class="morerecord" @click="morerecord">更多></span></span>
      <group v-if="items.length !== 0">
        <cell-box v-for="(item, key) in items" v-bind:key="key" style="font-size: 14px" @click.native="tinfo(item.tid)">
          <flexbox>
            <flexbox-item :span="1/12">
              <img src="../assets/images/xbcmin.png" v-if="item.type === 1">
              <img src="../assets/images/xbcplus.png" v-else>
            </flexbox-item>
            <flexbox-item style="padding-left: 10px">
              <flexbox orient="vertical">
                <flexbox-item class="tradeaddress" v-if="item.type === 1">转账到 {{item.recipientId}}</flexbox-item>
                <flexbox-item class="tradeaddress" v-else>收款从 {{item.senderId}}</flexbox-item>
                <flexbox-item style="color:#b2b2b2;">{{item.t_timestamp | goodTime}}</flexbox-item>
              </flexbox>
            </flexbox-item>
            <flexbox-item :span="1/5" style="text-align: right">
              <span style="color: red" v-if="item.type === 1">{{'-' + item.amount / 100000000}}</span>
              <span style="color: green" v-else>{{'+' + item.amount / 100000000}}</span> XBC
            </flexbox-item>
          </flexbox>
        </cell-box>
      </group>
      <load-more :show-loading="false" tip="暂无交易记录" v-else></load-more>
    </div>
    <popup v-model="t_show" style="background-color:#fff;text-align: center" v-bind:style="{paddingBottom: paddingbs}">
      <group title="交易详情" label-align="left" title-color="#000000">
        <cell>
          <div slot="title" style="font-size: 14px">交易ID</div>
          <div class="t_data">{{t_id}}</div>
        </cell>
        <cell>
          <div slot="title" style="font-size: 14px">发送地址</div>
          <div class="t_data">{{t_senderId}}</div>
        </cell>
        <cell>
          <div slot="title" style="font-size: 14px">接收地址</div>
          <div class="t_data">{{t_recipientId}}</div>
        </cell>
        <cell>
          <div slot="title" style="font-size: 14px">交易时间</div>
          <div class="t_data">{{t_time}}</div>
        </cell>
        <cell>
          <div slot="title" style="font-size: 14px">金额</div>
          <div class="t_data">{{t_fee}} XBC</div>
        </cell>
        <cell>
          <div slot="title" style="font-size: 14px">区块高度</div>
          <div class="t_data">{{t_height}}</div>
        </cell>
      </group>
    </popup>
    <loading :show="loading_show"></loading>
    <tabbar style="position:fixed" v-bind:style="{paddingBottom: paddingbs}">
      <tabbar-item selected>
        <img slot="icon" src="../assets/images/assets.png">
        <img slot="icon-active" src="../assets/images/assets_selected.png">
        <span slot="label">资产</span>
      </tabbar-item>
      <tabbar-item link="/ucenter">
        <img slot="icon" src="../assets/images/my.png">
        <img slot="icon-active" src="../assets/images/my_selected.png">
        <span slot="label">我的</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
import { Flexbox, FlexboxItem, Tabbar, TabbarItem, Group, CellBox, Cell, Popup, dateFormat, Loading, LoadMore } from 'vux'
import statusbar from '../plus/statusbar'
import webview from '../plus/webview'
import backReady from '../plus/backReady'
const baseUrl = 'http://120.24.216.224:8360/api'

export default {
  components: {
    Flexbox, FlexboxItem, Tabbar, TabbarItem, Group, CellBox, Cell, Popup, Loading, LoadMore
  },
  data () {
    return {
      paddings: '0px',
      paddingbs: '0px',
      token: '',
      xbc: '',
      rmb: '',
      items: [],
      offset: 0,
      t_show: false,
      t_id: '',
      t_senderId: '',
      t_recipientId: '',
      t_time: '',
      t_fee: '',
      t_height: '',
      loading_show: false
    }
  },
  methods: {
    getbalances () {
      let token = this.token
      this.$http.post(baseUrl + '/transaction/getbalances', {token: token}).then(response => {
        if (response.data.errno === 0) {
          this.xbc = response.data.data
          this.rmb = (this.xbc / 2.4).toFixed(2)
        } else {
          window.localStorage.removeItem('token')
          this.$vux.toast.show({
            text: response.data.errmsg + ',请重新登录',
            type: 'warn',
            position: 'middle',
            onHide () {
              // self.$router.push({path: '/login', name: 'login'})
              webview.open('index.html#/login', 'login')
            }
          })
        }
      })
    },
    getdata (offset) {
      let token = this.token
      this.$http.post(baseUrl + '/transaction/gettransactions', {token: token, offset: offset}).then(response => {
        if (response.data.errno === 0) {
          this.items = response.data.data
        }
      })
    },
    tinfo (tid) {
      let token = this.token
      this.loading_show = true
      this.$http.post(baseUrl + '/transaction/transactioninfo', {token: token, tid: tid}).then(response => {
        if (response.data.errno === 0) {
          const args = JSON.parse(response.data.data.args)
          this.t_id = tid
          this.t_senderId = response.data.data.senderId
          this.t_recipientId = args[2]
          this.t_time = dateFormat((response.data.data.timestamp + 1467057600) * 1000)
          this.t_fee = args[1] / 100000000
          this.t_height = response.data.data.height
          setTimeout(() => {
            this.loading_show = false
            this.t_show = true
          }, 500)
        }
      })
    },
    refresh () {
      this.loading_show = true
      setTimeout(() => {
        this.getbalances()
        this.getdata()
        this.loading_show = false
      }, 1000)
    },
    transfer () {
      webview.open('index.html#/transfer', 'transfer',
        {
          backButtonAutoControl: 'close',
          titleNView: {autoBackButton: true, backgroundColor: '#ffffff', titleText: '资产转账'}
        }
      )
    },
    collect () {
      webview.open('index.html#/collect', 'collect',
        {
          backButtonAutoControl: 'close',
          titleNView: {autoBackButton: true, backgroundColor: '#ffffff', titleText: '收款'}
        }
      )
    },
    morerecord () {
      // this.$router.push({path: '/record', name: 'record'})
      webview.open('index.html#/record', 'record',
        {
          backButtonAutoControl: 'close',
          titleNView: {autoBackButton: true, backgroundColor: '#ffffff', titleText: '交易记录'}
        }
      )
    },
    backaction () {
      let first = null
      backReady.backReady(() => {
        if (!first) {
          first = new Date().getTime()
          setTimeout(function () { first = null }, 2000)
          this.$vux.toast.show({text: '再按一次退出钱包', type: 'text', position: 'bottom'})
        } else {
          if (new Date().getTime() - first < 2000) {
            backReady.quit()
          }
        }
      })
    },
    plusReadys () {
      this.paddings = statusbar.getStatusbarHeight()
      if (this.paddings === '44px') {
        this.paddingbs = '34px'
      }
      statusbar.setStatusBarStyle('light')
      webview.closeall()
      this.backaction()
    }
  },
  created: function () {
    if (navigator.userAgent.indexOf('Html5Plus') > -1) {
      this.plusReady(this.plusReadys)
    }
    this.token = window.localStorage.getItem('token')
    if (this.token === null) {
      this.$router.push({path: '/login', name: 'login'})
    } else {
      this.getbalances()
      this.getdata(0)
    }
  }
}
</script>
