/* eslint-disable */
const setStatusBarStyle = function (styles) {
  plus.navigator.setStatusBarStyle(styles)
}
const getStatusbarHeight = function (){
  let topoffset = Math.round(plus.navigator.getStatusbarHeight())
  if(plus.device.model === 'iPhoneX') {
    topoffset = topoffset + 24
  }
  return topoffset + 'px'
}

module.exports = {setStatusBarStyle, getStatusbarHeight}
