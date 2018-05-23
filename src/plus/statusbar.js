/* eslint-disable */
const setStatusBarStyle = function (styles) {
  plus.navigator.setStatusBarStyle(styles)

}
const getStatusbarHeight = function (){
  const topoffset = (Math.round(plus.navigator.getStatusbarHeight())) + 'px'
  return topoffset
}

module.exports = {setStatusBarStyle, getStatusbarHeight}
