<template>
  <div class="reg">
    <x-header :left-options="{backText: ''}">创建钱包账户</x-header>
    <div class="reginfo">
      <step v-model="step" background-color='#f5f6f8' gutter="10px">
        <step-item title="创建主密码"></step-item>
        <step-item title="确认主密码"></step-item>
        <step-item title="创建账户成功"></step-item>
      </step>
      <group style="margin-top: 50px;margin-bottom: 20px">
        <x-textarea placeholder="请输入刚才保存的主密码" :autosize=true v-model="secret"></x-textarea>
      </group>
      <x-button :gradients="['#d9ab78', '#f2cca2']" @click.native="reg">确认创建账户</x-button>
    </div>
  </div>
</template>

<script>
import { XHeader, Step, StepItem, XButton, XTextarea, Group } from 'vux'
export default {
  components: {XHeader, Step, StepItem, XButton, XTextarea, Group},
  data () {
    return {
      step: 1,
      secret: ''
    }
  },
  methods: {
    reg () {
      if (window.localStorage.getItem('regsecret') !== this.secret) {
        this.$vux.toast.show({text: '您输入的主密码不一致', type: 'text', position: 'middle'})
        return
      }
      const secret = this.secret
      this.$http.post('http://192.168.2.102:8360/api/account/reg', {secret: secret}).then(response => {
        this.returndata = response.data
        if (this.returndata.errno === 0) {
          this.$vux.toast.show({
            text: this.returndata.errmsg,
            position: 'middle',
            onHide: () => {
              window.localStorage.setItem('token', this.returndata.data)
              this.$router.push({path: '/index', name: 'index'})
            }
          })
        } else {
          this.$vux.toast.show({text: this.returndata.errmsg, type: 'text', position: 'middle'})
        }
      })
    }
  }
}
</script>
