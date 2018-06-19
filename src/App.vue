<template>
  <router-view></router-view>
</template>
<!--
<script>
import backReady from './plus/backReady'
export default {
  data () {
    return {
      transitionName: '',
      quitroute: ['index', 'login']
    }
  },
  watch: {
    $route (to, from) {
      if (to.meta.index > from.meta.index) {
        this.transitionName = 'turn-on'
      } else {
        this.transitionName = 'turn-off'
      }
      if (navigator.userAgent.indexOf('Html5Plus') > -1) {
        this.plusReady(this.backaction)
      }
    }
  },
  methods: {
    backaction () {
      if (this.quitroute.indexOf(this.$route.name) !== -1) {
        let first = null
        backReady.backReady(() => {
          if (!first) {
            first = new Date().getTime()
            setTimeout(function () { first = null }, 2000)
            backReady.toast()
          } else {
            if (new Date().getTime() - first < 2000) {
              backReady.quit()
            }
          }
        })
      } else {
        backReady.backReady(() => {
          this.$router.back(-1)
        })
      }
    }
  }
}
</script>
-->
<style lang="less">
  @import '~vux/src/styles/reset.less';
  @import "./assets/less/app.less";
</style>
