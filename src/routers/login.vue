<template>
  <div class="login" v-bind:style="{paddingTop: paddings}">
    <div class="loginheader">
      <img src="../assets/images/applongin.png"/>
      <div class="logintitle">星呗钱包</div>
    </div>
    <group style="margin-top: 50px;margin-bottom: 20px">
      <x-textarea placeholder="请输入12个助记单词" :autosize=true v-model="secret"></x-textarea>
    </group>
    <x-button :gradients="['#d9ab78', '#f2cca2']" @click.native="login">进入钱包</x-button>
    <div class="regbutton" @click="reg1">创建钱包账户</div>
  </div>
</template>

<script>
import { XTextarea, Group, XButton } from 'vux'
import statusbar from '../plus/statusbar'
import webview from '../plus/webview'
import backReady from '../plus/backReady'
const baseUrl = 'http://120.24.216.224:8360/api'
export default {
  components: {XTextarea, Group, XButton},
  data () {
    return {
      paddings: 0,
      secret: '',
      returndata: ''
    }
  },
  methods: {
    login () {
      if (this.secret === '') {
        this.$vux.toast.show({text: '请输入助记词', type: 'text', position: 'middle'})
        return
      } else if (this.secret.trim().split(/\s+/g).length < 12) {
        this.$vux.toast.show({text: '格式不符合BIP39安全规范', type: 'text', position: 'middle'})
        return
      }
      const secret = this.secret
      this.$http.post(baseUrl + '/account/login', {secret: secret}).then(response => {
        this.returndata = response.data
        if (this.returndata.errno === 0) {
          this.$vux.toast.show({
            text: this.returndata.errmsg,
            position: 'middle',
            onHide: () => {
              window.localStorage.setItem('token', this.returndata.data)
              // this.$router.push({path: '/index', name: 'index'})
              this.plusReady(function () {
                webview.open('index.html#/', 'index')
              })
            }
          })
        } else {
          this.$vux.toast.show({text: this.returndata.errmsg, type: 'text', position: 'middle'})
        }
      })
    },
    reg1 () {
      // this.$router.push({path: '/reg', name: 'reg'})
      webview.open('index.html#/reg', 'reg',
        {
          backButtonAutoControl: 'close',
          titleNView: {autoBackButton: true, backgroundColor: '#ffffff', titleText: '创建钱包账户'}
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
      statusbar.setStatusBarStyle('light')
      webview.closeall()
      this.backaction()
    }
  },
  created: function () {
    if (navigator.userAgent.indexOf('Html5Plus') > -1) {
      this.plusReady(this.plusReadys)
    }
  }
}
</script>
