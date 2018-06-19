<template>
  <div class="records">
<!--    <div class="xheader" v-bind:style="{paddingTop: paddings}">
      <x-header :left-options="{backText: ''}" style="background-color:#ffffff;">交易记录</x-header>
    </div>-->
    <div class="record" v-bind:style="{paddingBottom: paddingbs}">
      <group v-if="items.length !== 0">
        <scroller bounce lock-x use-pullup use-pulldown height="-46" @on-pullup-loading="loadMore" @on-pulldown-loading="refresh(false)" v-model="status" ref="scroller">
          <div>
            <cell-box v-for="(item, key) in items" v-bind:key="key" style="font-size: 14px" @click.native="tinfo(item.tid)">
              <flexbox>
                <flexbox-item :span="1/12">
                  <img src="../assets/images/xbcmin.png" v-if="item.type === 1">
                  <img src="../assets/images/xbcplus.png" v-else>
                </flexbox-item>
                <flexbox-item style="padding-left: 10px">
                  <flexbox orient="vertical">
                    <flexbox-item class="tradeaddress" v-if="item.type === 1">转账到 {{item.recipientId}}</flexbox-item>
                    <flexbox-item class="tradeaddress" v-else>收款从 {{item.senderId}}</flexbox-item>
                    <flexbox-item style="color:#b2b2b2;">{{item.t_timestamp | goodTime}}</flexbox-item>
                  </flexbox>
                </flexbox-item>
                <flexbox-item :span="1/4" style="text-align: right">
                  <span style="color: red" v-if="item.type === 1">{{'-' + item.amount / 100000000}}</span>
                  <span style="color: green" v-else>{{'+' + item.amount / 100000000}}</span> XBC
                </flexbox-item>
              </flexbox>
            </cell-box>
          </div>
          <div slot="pullup" class="xs-plugin-pullup-container xs-plugin-pullup-up" style="position: absolute; width: 100%; height: 40px; bottom: -40px; text-align: center;">
            <span v-show="status.pullupStatus === 'up'"></span>
            <span v-show="status.pullupStatus === 'down'"></span>
            <span v-show="status.pullupStatus === 'loading'"><spinner type="lines"></spinner></span>
          </div>
          <div slot="pulldown" class="xs-plugin-pulldown-container xs-plugin-pulldown-down" style="position: absolute; width: 100%; height: 60px; line-height: 60px; top: -60px; text-align: center;">
            <span v-show="status.pulldownStatus === 'down'">下拉刷新</span>
            <span v-show="status.pulldownStatus === 'up'">松开刷新</span>
            <span v-show="status.pulldownStatus === 'loading'"><spinner type="lines"></spinner></span>
          </div>
          <load-more :show-loading="false" tip="全部加载完成" v-show="nonerecord"></load-more>
        </scroller>
      </group>
      <load-more :show-loading="false" tip="暂无交易记录" v-else></load-more>
    </div>
    <popup v-model="t_show" style="background-color:#fff;text-align: center" v-bind:style="{paddingBottom: paddingbs}">
      <group title="交易详情" label-align="left" title-color="#000000">
        <cell>
          <div slot="title" style="font-size: 14px">交易ID</div>
          <div class="t_data">{{t_id}}</div>
        </cell>
        <cell>
          <div slot="title" style="font-size: 14px">发送地址</div>
          <div class="t_data">{{t_senderId}}</div>
        </cell>
        <cell>
          <div slot="title" style="font-size: 14px">接收地址</div>
          <div class="t_data">{{t_recipientId}}</div>
        </cell>
        <cell>
          <div slot="title" style="font-size: 14px">交易时间</div>
          <div class="t_data">{{t_time}}</div>
        </cell>
        <cell>
          <div slot="title" style="font-size: 14px">金额</div>
          <div class="t_data">{{t_fee}} XBC</div>
        </cell>
        <cell>
          <div slot="title" style="font-size: 14px">区块高度</div>
          <div class="t_data">{{t_height}}</div>
        </cell>
      </group>
    </popup>
    <loading :show="loading_show"></loading>
  </div>
</template>

<script>
import { XHeader, Group, CellBox, Cell, Flexbox, FlexboxItem, Popup, dateFormat, Loading, Scroller, LoadMore, Spinner } from 'vux'
import statusbar from '../plus/statusbar'
const baseUrl = 'http://120.24.216.224:8360/api'
export default {
  components: {
    XHeader, Group, Cell, CellBox, Flexbox, FlexboxItem, Popup, Loading, Scroller, LoadMore, Spinner
  },
  data () {
    return {
      paddings: '0px',
      paddingbs: '0px',
      token: '',
      items: [],
      offset: 0,
      t_show: false,
      t_id: '',
      t_senderId: '',
      t_recipientId: '',
      t_time: '',
      t_fee: '',
      t_height: '',
      nonerecord: false,
      loading_show: false,
      status: {
        pullupStatus: 'default',
        pulldownStatus: 'default'
      }
    }
  },
  methods: {
    refresh (isloadpage) {
      let token = this.token
      let returndata
      let times
      this.nonerecord = false
      if (isloadpage) {
        times = 0
      } else {
        times = 1000
      }
      setTimeout(() => {
        this.$http.post(baseUrl + '/transaction/gettransactions', {token: token, offset: 0}).then(response => {
          if (response.data.errno === 0) {
            returndata = response.data.data
            if (returndata.length === 10) {
              this.items = returndata
              this.offset = 10
              if (!isloadpage) this.$refs.scroller.enablePullup()
            } else if (returndata.length < 10 && returndata.length !== 0) {
              this.items = returndata
              this.nonerecord = true
              if (!isloadpage) this.$refs.scroller.disablePullup()
            } else {
              this.nonerecord = true
              if (!isloadpage) this.$refs.scroller.disablePullup()
            }
            if (!isloadpage) this.$refs.scroller.donePulldown()
          }
        })
      }, times)
    },
    loadMore () {
      let token = this.token
      let offset = this.offset
      let returndata
      setTimeout(() => {
        this.$http.post(baseUrl + '/transaction/gettransactions', {token: token, offset: offset}).then(response => {
          if (response.data.errno === 0) {
            returndata = response.data.data
            if (returndata.length === 10) {
              returndata.forEach((item, index) => {
                this.items.push(returndata[index])
              })
              this.offset = this.offset + 10
            } else if (returndata.length < 10 && returndata.length !== 0) {
              returndata.forEach((item, index) => {
                this.items.push(returndata[index])
              })
              this.offset = this.offset + returndata.length
              this.nonerecord = true
              this.$refs.scroller.disablePullup()
            } else {
              this.nonerecord = true
              this.$refs.scroller.disablePullup()
            }
            this.$refs.scroller.donePullup()
          }
        })
      }, 1000)
    },
    tinfo (tid) {
      let token = this.token
      this.loading_show = true
      this.$http.post(baseUrl + '/transaction/transactioninfo', {token: token, tid: tid}).then(response => {
        if (response.data.errno === 0) {
          const args = JSON.parse(response.data.data.args)
          this.t_id = tid
          this.t_senderId = response.data.data.senderId
          this.t_recipientId = args[2]
          this.t_time = dateFormat((response.data.data.timestamp + 1467057600) * 1000)
          this.t_fee = args[1] / 100000000
          this.t_height = response.data.data.height
          setTimeout(() => {
            this.loading_show = false
            this.t_show = true
          }, 500)
        }
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
    this.token = window.localStorage.getItem('token')
    if (this.token === null) {
      this.$router.push({path: '/login', name: 'login'})
    }
  },
  mounted: function () {
    this.refresh(true)
  }
}
</script>
