<template>
  <div class="ucenter">
    <div class="uheader" v-bind:style="{paddingTop: paddings}">
      <div class="logo">
        <img src="../assets/images/indexlogo.png" style="vertical-align: middle">
        <span style="vertical-align: middle;color: #ffffff">星呗钱包</span>
        <div class="refresh" @click="logoutshow = true">
          <img src="../assets/images/logout.png">
        </div>
      </div>
    </div>
    <group title="用户中心">
      <cell title="查看账单" is-link @click.native="record">
        <img slot="icon" width="25" style="display:block;margin-right: 24px" src="../assets/images/record.png">
      </cell>
      <cell title="选择语言" is-link @click.native="languageshow = true">
        <img slot="icon" width="25" style="display:block;margin-right: 24px" src="../assets/images/language.png">
      </cell>
      <cell title="区块详情" is-link @click.native="block">
        <img slot="icon" width="25" style="display:block;margin-right: 24px" src="../assets/images/block.png">
      </cell>
      <cell title="关于我们" is-link @click.native="aboutshow = true">
        <img slot="icon" width="25" style="display:block;margin-right: 24px" src="../assets/images/about.png">
      </cell>
    </group>
    <confirm v-model="logoutshow" title="确认退出吗?" content="请确保已经备份秘钥助记词，否则将丢失所有资产!" @on-confirm="logout"></confirm>
    <popup v-model="languageshow" style="background-color:#fff;text-align: center" v-bind:style="{paddingBottom: paddingbs}">
      <group title="选择语言">
        <radio value="中文" :options="languageradio" @on-change="languages" style="text-align: left"></radio>
      </group>
    </popup>
    <x-dialog v-model="aboutshow" hide-on-blur>
      <div style="padding: 20px 0">
        <img src="../assets/images/applongin.png"/>
      </div>
      <a href="https://www.xingbei.io">xingbei.io</a>
      <div style="padding-bottom: 20px">星呗钱包 V1.0(Test)</div>
    </x-dialog>
    <tabbar style="position:fixed" v-bind:style="{paddingBottom: paddingbs}">
      <tabbar-item link="/">
        <img slot="icon" src="../assets/images/assets.png">
        <img slot="icon-active" src="../assets/images/assets_selected.png">
        <span slot="label">资产</span>
      </tabbar-item>
      <tabbar-item selected>
        <img slot="icon" src="../assets/images/my.png">
        <img slot="icon-active" src="../assets/images/my_selected.png">
        <span slot="label">我的</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
import { Tabbar, TabbarItem, Group, Cell, Popup, Confirm, Radio, XDialog } from 'vux'
import statusbar from '../plus/statusbar'
import webview from '../plus/webview'
export default {
  components: {
    Tabbar, TabbarItem, Group, Cell, Popup, Confirm, Radio, XDialog
  },
  data () {
    return {
      paddings: '0px',
      paddingbs: '0px',
      logoutshow: false,
      languageshow: false,
      languageradio: ['中文', 'English'],
      aboutshow: false
    }
  },
  methods: {
    logout () {
      window.localStorage.clear()
      // this.$router.push({path: '/login', name: 'login'})
      webview.open('index.html#/login', 'login')
    },
    record () {
      webview.open('index.html#/record', 'record',
        {
          backButtonAutoControl: 'close',
          titleNView: {autoBackButton: true, backgroundColor: '#ffffff', titleText: '交易记录'}
        }
      )
    },
    block () {
      webview.open('index.html#/block', 'block',
        {
          backButtonAutoControl: 'close',
          titleNView: {autoBackButton: true, backgroundColor: '#ffffff', titleText: '区块详情'}
        }
      )
    },
    languages (value) {
      if (value === 'English') {
        this.$vux.toast.show({text: 'This wallet does not support English for the time being, please look forward to it', type: 'text', position: 'middle'})
      }
    },
    plusReadys () {
      this.paddings = statusbar.getStatusbarHeight()
      if (this.paddings === '44px') {
        this.paddingbs = '34px'
      }
      statusbar.setStatusBarStyle('light')
    }
  },
  created: function () {
    if (navigator.userAgent.indexOf('Html5Plus') > -1) {
      this.plusReady(this.plusReadys)
    }
  }
}
</script>
