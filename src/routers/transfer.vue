<template>
  <div class="transfer">
<!--    <div class="xheader" v-bind:style="{paddingTop: paddings}">
      <x-header :left-options="{backText: ''}" style="background-color:#ffffff;">资产转账<img @click='qrscan' slot="right" src="../assets/images/qrscan.png">
      </x-header>
    </div>-->
    <group title="转账信息" style="margin-bottom: 20px">
      <x-input v-model="address" required title="转账地址" placeholder="请输入收款人账户地址" :min="34" :max="34"></x-input>
      <x-input v-model="amount" type="number" required title="转账金额" placeholder="请输入转账金额"></x-input>
      <x-input v-model="poundage" title="手续费" disabled></x-input>
    </group>
    <div style="padding: 0 10px">
      <x-button :gradients="['#d9ab78', '#f2cca2']" @click.native="nextstep">下一步</x-button>
      <x-button :gradients="['#d9ab78', '#f2cca2']" @click.native="qrscan">扫码转账</x-button>
    </div>
    <popup v-model="t_show" v-bind:style="{paddingBottom: paddingbs}">
      <div class="nextstep">
        <div class="tiptext">向对方转账</div>
        <div class="address">{{address}}</div>
        <div class="amount">{{amount}} XBC</div>
        <x-button :gradients="['#d9ab78', '#f2cca2']" @click.native="transfer">确认转账</x-button>
      </div>
    </popup>
  </div>
</template>

<script>
import {XHeader, Group, XInput, XButton, Popup} from 'vux'
import statusbar from '../plus/statusbar'
import webview from '../plus/webview'
const baseUrl = 'http://120.24.216.224:8360/api'
export default {
  components: {
    XHeader, Group, XInput, XButton, Popup
  },
  data () {
    return {
      paddings: '0px',
      paddingbs: '0px',
      address: '',
      amount: '',
      poundage: '0.1 XBC',
      t_show: false,
      returndata: ''
    }
  },
  methods: {
    nextstep () {
      if (this.address === '') {
        this.$vux.toast.show({text: '请输入转账地址', type: 'text', position: 'middle'})
        return
      } else if (this.amount === '') {
        this.$vux.toast.show({text: '请输入转账金额', type: 'text', position: 'middle'})
        return
      } else if (this.address.length !== 34) {
        this.$vux.toast.show({text: '转账地址长度不正确', type: 'text', position: 'middle'})
        return
      }
      this.t_show = true
    },
    transfer () {
      const address = this.address
      const amount = this.amount
      const token = window.localStorage.getItem('token')
      this.$http.post(baseUrl + '/transaction/transfer', {token: token, address: address, amount: amount}).then(response => {
        this.returndata = response.data
        if (this.returndata.errno === 0) {
          this.$vux.toast.show({
            text: this.returndata.errmsg,
            position: 'middle',
            onHide: () => {
              this.$router.push({path: '/record', name: 'record'})
            }
          })
        } else {
          this.$vux.toast.show({text: this.returndata.errmsg, type: 'text', position: 'middle'})
        }
      })
    },
    qrscan () {
      this.plusReady(function () {
        webview.open('/index.html#/qrscan', 'qrscan',
          {
            backButtonAutoControl: 'close',
            titleNView: {autoBackButton: true, backgroundColor: '#ffffff', titleText: '扫描二维码'}
          }
        )
      })
    },
    plusReadys () {
      this.paddings = statusbar.getStatusbarHeight()
      if (this.paddings === '44px') {
        this.paddingbs = '34px'
      }
      statusbar.setStatusBarStyle('dark')
    }
  },
  created: function () {
    if (navigator.userAgent.indexOf('Html5Plus') > -1) {
      this.plusReady(this.plusReadys)
    }
  },
  mounted: function () {
    let qresult = window.localStorage.getItem('result')
    if (qresult !== null) {
      qresult = JSON.parse(qresult)
      this.address = qresult.address
      this.amount = qresult.amount
      window.localStorage.removeItem('result')
    }
  }
}
</script>
