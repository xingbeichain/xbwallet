<template>
  <div class="collect">
<!--    <div class="xheader" v-bind:style="{paddingTop: paddings}">
      <x-header :left-options="{backText: ''}" style="background-color:#ffffff;">收款</x-header>
    </div>-->
    <group title="收款地址">
      <cell :title="address"></cell>
    </group>
    <group title="收款金额">
      <x-input v-model="amount" type="number" placeholder="可选"></x-input>
    </group>
    <group title="收款二维码">
      <qrcode :value='"{\"address\":\"" + address + "\",\"amount\":\"" + amount + "\"" + "}"' style="text-align: center;padding: 10px 0" ref="qrcodeImg"></qrcode>
    </group>
    <div style="padding: 20px 10px">
      <x-button :gradients="['#d9ab78', '#f2cca2']" @click.native="copyaddress" v-show="show">复制地址</x-button>
      <x-button :gradients="['#d9ab78', '#f2cca2']" @click.native="saveqrcode" v-show="show">保存二维码</x-button>
    </div>
  </div>
</template>

<script>
import {XHeader, Group, Cell, XInput, XButton, Qrcode} from 'vux'
import statusbar from '../plus/statusbar'
import saveimg from '../plus/saveimg'
import pasteboard from '../plus/pasteboard'
const baseUrl = 'http://120.24.216.224:8360/api'
export default {
  components: {
    XHeader, Group, Cell, XInput, XButton, Qrcode
  },
  data () {
    return {
      address: '',
      amount: '',
      show: false
    }
  },
  methods: {
    copyaddress () {
      this.plusReady(() => {
        pasteboard(this.address)
        this.$vux.toast.show({text: '复制成功', type: 'text', position: 'middle'})
      })
    },
    saveqrcode () {
      this.plusReady(() => {
        saveimg(this.$refs.qrcodeImg.imgData)
        this.$vux.toast.show({text: '保存成功', type: 'text', position: 'middle'})
      })
    },
    plusReadys () {
      statusbar.setStatusBarStyle('dark')
    }
  },
  created: function () {
    if (navigator.userAgent.indexOf('Html5Plus') > -1) {
      this.plusReady(this.plusReadys)
      this.show = true
    }
  },
  mounted: function () {
    const token = window.localStorage.getItem('token')
    let returndata
    this.$http.post(baseUrl + '/account/getaddress', {token: token}).then(response => {
      returndata = response.data
      if (returndata.errno === 0) {
        this.address = returndata.data
      }
    })
  }
}
</script>
