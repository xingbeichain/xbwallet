<template>
  <div class="reg">
    <x-header :left-options="{backText: ''}">创建钱包账户</x-header>
    <div class="reginfo">
      <step v-model="step" background-color='#f5f6f8' gutter="10px">
        <step-item title="创建主密码"></step-item>
        <step-item title="确认主密码"></step-item>
        <step-item title="创建账户成功"></step-item>
      </step>
      <group title="请保存主密码,它将是你登录的唯一依据" style="margin-top: 50px;margin-bottom: 20px">
        <x-textarea title="主密码：" :autosize=true v-model="secret"></x-textarea>
      </group>
      <x-button :gradients="['#d9ab78', '#f2cca2']" @click.native="reg2">我已保存助记词，下一步</x-button>
    </div>
  </div>
</template>

<script>
import { XHeader, Step, StepItem, XButton, XTextarea, Group } from 'vux'
export default {
  components: {XHeader, Step, StepItem, XButton, XTextarea, Group},
  data () {
    return {
      step: 0,
      secret: ''
    }
  },
  methods: {
    reg2 () {
      window.localStorage.setItem('regsecret', this.secret)
      this.$router.push({path: '/reg2', name: 'reg2'})
    }
  },
  mounted: function () {
    this.$http.get('http://118.25.20.232:4096/api/accounts/new').then(response => {
      this.secret = response.data.secret
    })
  }
}
</script>
