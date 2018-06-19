<template>
  <div class="reg">
<!--    <div class="xheader" v-bind:style="{paddingTop: paddings}">
      <x-header :left-options="{backText: ''}" style="background-color:#ffffff;">创建钱包账户</x-header>
    </div>-->
    <div class="reginfo">
      <step v-model="step" background-color='#f5f6f8' gutter="10px">
        <step-item title="创建主密码"></step-item>
        <step-item title="确认主密码"></step-item>
        <step-item title="创建账户成功"></step-item>
      </step>
      <transition name="turn-on">
        <div v-show="step1">
          <group title="请保存主密码,它将是你登录的唯一依据" style="margin-top: 50px;margin-bottom: 20px">
            <div @click="copysecret"><x-textarea title="主密码：" v-model="secret" autosize disabled></x-textarea></div>
          </group>
          <x-button :gradients="['#d9ab78', '#f2cca2']" @click.native="regstep1">我已保存助记词，下一步</x-button>
        </div>
      </transition>
      <transition name="turn-on">
        <div v-show="step2">
          <group style="margin-top: 50px;margin-bottom: 20px">
            <x-textarea placeholder="请输入刚才保存的主密码" autosize v-model="regsecret"></x-textarea>
          </group>
          <x-button :gradients="['#d9ab78', '#f2cca2']" :show-loading="loadings" :disabled="disableds" @click.native="regstep2">确认创建账户</x-button>
        </div>
      </transition>
      <transition name="turn-on">
        <div v-show="step3">
          <msg title="账户创建成功" description="请牢记主密码，它将是你登录钱包的唯一依据！测试版钱包注册将赠送100XBC，您可以进入钱包查看" icon="success">
            <template slot="buttons">
              <x-button :gradients="['#d9ab78', '#f2cca2']" @click.native="toindex">进入钱包</x-button>
            </template>
          </msg>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { XHeader, Step, StepItem, XButton, XTextarea, Group, Msg } from 'vux'
import statusbar from '../plus/statusbar'
import webview from '../plus/webview'
import pasteboard from '../plus/pasteboard'
const baseUrl = 'http://120.24.216.224:8360/api'
export default {
  components: {XHeader, Step, StepItem, XButton, XTextarea, Group, Msg},
  data () {
    return {
      step1: true,
      step2: false,
      step3: false,
      step: 0,
      loadings: false,
      disableds: false,
      secret: '',
      regsecret: '',
      returndata: ''
    }
  },
  methods: {
    regstep1 () {
      this.step1 = false
      this.step2 = true
      this.step = 1
      window.localStorage.setItem('regsecret', this.secret)
    },
    regstep2 () {
      if (window.localStorage.getItem('regsecret') !== this.regsecret) {
        this.$vux.toast.show({text: '您输入的主密码不一致', type: 'text', position: 'middle'})
        return
      }
      this.loadings = true
      this.disableds = true
      setTimeout(this.createaccount, 2000)
    },
    createaccount () {
      const secret = this.regsecret
      this.$http.post(baseUrl + '/account/reg', {secret: secret}).then(response => {
        this.returndata = response.data
        if (this.returndata.errno === 0) {
          window.localStorage.setItem('token', this.returndata.data)
          window.localStorage.removeItem('regsecret')
          this.step2 = false
          this.step3 = true
          this.step = 3
        } else {
          this.$vux.toast.show({text: this.returndata.errmsg, type: 'text', position: 'middle'})
        }
        this.loadings = false
        this.disableds = false
      })
    },
    copysecret () {
      if (navigator.userAgent.indexOf('Html5Plus') > -1) {
        this.plusReady(() => {
          pasteboard(this.secret)
          this.$vux.toast.show({text: '复制成功', type: 'text', position: 'middle'})
        })
      }
    },
    toindex () {
      webview.open('index.html#/', 'index')
    },
    plusReadys () {
      this.paddings = statusbar.getStatusbarHeight()
      statusbar.setStatusBarStyle('dark')
    }
  },
  mounted: function () {
    let regsecret = window.localStorage.getItem('regsecret')
    if (regsecret === null) {
      this.$http.get('http://118.25.20.232:4096/api/accounts/new').then(response => {
        this.secret = response.data.secret
      })
    } else {
      this.secret = regsecret
    }
  },
  created: function () {
    if (navigator.userAgent.indexOf('Html5Plus') > -1) {
      this.plusReady(this.plusReadys)
    }
  }
}
</script>
