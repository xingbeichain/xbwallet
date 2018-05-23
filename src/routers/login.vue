<template>
  <div class="login" v-bind:style="{paddingTop: paddings}">
    <div class="loginheader">
      <img src="../assets/applongin.png"/>
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
import { XTextarea, Group, XButton, cookie } from 'vux'
import statusbar from '../plus/statusbar'
export default {
  components: {
    XTextarea, Group, XButton
  },
  data () {
    return {
      paddings: '0',
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
      this.$http.post('http://192.168.2.102:8360/api/account/login', {secret: secret}).then(response => {
        this.returndata = response.data
        if (this.returndata.errno === 0) {
          this.$vux.toast.show({
            text: this.returndata.errmsg,
            position: 'middle',
            onHide: () => {
              cookie.set('token', this.returndata.data)
              this.$router.push({path: '/index', name: 'index'})
            }
          })
        } else {
          this.$vux.toast.show({text: this.returndata.errmsg, type: 'text', position: 'middle'})
        }
      })
    },
    reg1 () {
      this.$router.push({path: '/reg', name: 'reg'})
    },
    plusReadys () {
      this.paddings = statusbar.getStatusbarHeight()
      statusbar.setStatusBarStyle('dark')
    }
  },
  created: function () {
    if (navigator.userAgent.indexOf('Html5Plus') > -1) {
      this.plusReady(this.plusReadys)
    }
  }
}
</script>
