<template>
  <div>
    <div id="bcid" v-bind:style="{bottom: bottom}">
      <div style="height:40%"></div>
      <p class="tip">载入中...</p>
    </div>
    <footer v-bind:style="{paddingBottom: paddingbs}">
      <div class="fbt" @click="flash">打开闪光灯</div>
      <div class="fbt" @click="scanPicture">从相册选择二维码</div>
    </footer>
  </div>
</template>

<script>
import statusbar from '../plus/statusbar'
import qrcode from '../plus/qrcode'
export default {
  data () {
    return {
      bottom: '44px',
      paddings: '0px',
      paddingbs: '0px'
    }
  },
  methods: {
    flash () {
      this.plusReady(function () {
        qrcode.flash(true)
      })
    },
    scanPicture () {
      this.plusReady(function () {
        qrcode.scanPicture()
      })
    },
    plusReadys () {
      this.paddings = statusbar.getStatusbarHeight()
      if (this.paddings === '44px') {
        this.paddingbs = '34px'
        this.bottom = '78px'
      }
      statusbar.setStatusBarStyle('dark')
      qrcode.scan()
    }
  },
  created: function () {
    if (navigator.userAgent.indexOf('Html5Plus') > -1) {
      this.plusReady(this.plusReadys)
    }
  }
}
</script>
<style>
  #bcid {
    background: #000000;
    width: 100%;
    position: absolute;
    top: 0;
    text-align: center;
  }
  .tip {
    color: #FFFFFF;
    font-weight: bold;
    text-shadow: 0 -1px #103E5C;
  }
  footer {
    background-color: #FFCC33;
    width: 100%;
    height: 44px;
    position: absolute;
    bottom: 0;
    line-height: 44px;
    text-align: center;
    color: #FFF;
  }
  .fbt {
    width: 50%;
    height: 100%;
    float: left;
  }
  .fbt:active {
    -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.5);
    box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.5);
  }
</style>
