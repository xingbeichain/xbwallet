<template>
 <div class="block">
<!--   <div class="xheader" v-bind:style="{paddingTop: paddings}">
     <x-header :left-options="{backText: ''}" style="background-color:#ffffff;">区块详情</x-header>
   </div>-->
   <group>
     <cell title="最后区块高度" v-model="blockheight"></cell>
     <cell title="版本信息" value="1.3.6"></cell>
     <cell title="Build" value="development"></cell>
     <cell title="net" value="testnet"></cell>
   </group>
 </div>
</template>

<script>
import {XHeader, Group, Cell} from 'vux'
import statusbar from '../plus/statusbar'
export default {
  components: {
    XHeader, Group, Cell
  },
  data () {
    return {
      blockheight: 0
    }
  },
  methods: {
    plusReadys () {
      statusbar.setStatusBarStyle('dark')
    }
  },
  created: function () {
    if (navigator.userAgent.indexOf('Html5Plus') > -1) {
      this.plusReady(this.plusReadys)
    }
  },
  mounted: function () {
    let returndata
    this.$http.get('http://118.25.20.232:4096/api/dapps/208c7bec681e5ce63fde8e1075c9c3981b71aa44a9c04b19c79881eee61e12d5/blocks/height').then(response => {
      returndata = response.data
      if (returndata.success) {
        this.blockheight = returndata.height
      }
    })
  }
}
</script>
