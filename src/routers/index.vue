<template>
  <div>
    <div class="header" v-bind:style="{paddingTop: paddings}">
      <div class="logo">
        <img src="../assets/indexlogo.png" style="vertical-align: middle">
        <span style="vertical-align: middle;color: #ffffff">星呗钱包</span>
      </div>
      <div class="money">{{xbc}}</div>
      <div class="xbc">总资产(XBC) ≈ ￥{{rmb}}</div>
    </div>
    <flexbox class="translate">
      <flexbox-item>
        <div class="transfer">
          <img src="../assets/transfer.png" style="vertical-align: middle">
          <span style="vertical-align: middle">我要转账</span>
        </div>
      </flexbox-item>
      <flexbox-item>
        <div class="collect">
          <img src="../assets/Collect.png" style="vertical-align: middle">
          <span style="vertical-align: middle">我要收钱</span>
        </div>
      </flexbox-item>
    </flexbox>
    <div class="record">
      <div class="title">交易记录</div>
    </div>
    <tabbar>
      <tabbar-item selected>
        <img slot="icon" src="../assets/indexlogo.png">
        <img slot="icon-active" src="">
        <span slot="label">资产</span>
      </tabbar-item>
      <tabbar-item>
        <img slot="icon" src="../assets/indexlogo.png">
        <span slot="label">我的</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
import { Flexbox, FlexboxItem, Tabbar, TabbarItem, cookie } from 'vux'
import statusbar from '../plus/statusbar'

export default {
  components: {
    Flexbox, FlexboxItem, Tabbar, TabbarItem
  },
  data () {
    return {
      paddings: 0,
      address: '',
      secret: '',
      xbc: '',
      rmb: ''
    }
  },
  methods: {
    plusReadys () {
      this.paddings = statusbar.getStatusbarHeight()
      statusbar.setStatusBarStyle('light')
    }
  },
  created: function () {
    if (navigator.userAgent.indexOf('Html5Plus') > -1) {
      this.plusReady(this.plusReadys)
    }
    this.address = cookie.get('address')
    this.secret = cookie.get('secret')
    if (this.address === undefined) {
      this.$router.push({path: '/login', name: 'login'})
    } else {
      this.$http.get('http://118.25.20.232:4096/api/uia/balances/' + this.address + '/xingbei.XBC').then(response => {
        if (response.data.success === false) {
          this.xbc = 0
          this.rmb = 0
        } else {
          this.xbc = response.data.balance.balance / 100000000
          this.rmb = this.xbc / 2
        }
      })
    }
  }
}
</script>
