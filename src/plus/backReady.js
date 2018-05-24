/* eslint-disable */
const backReady = function (fn) {
  plus.key.removeEventListener('backbutton', fn)
  plus.key.addEventListener('backbutton', fn)
}
const toast = function () {
  plus.nativeUI.toast('再按一次退出应用')
}
const quit = function () {
  plus.runtime.quit()
}
module.exports = {backReady, toast, quit}
