/* eslint-disable */
const backReady = function (fn) {
  plus.key.removeEventListener('backbutton', fn)
  plus.key.addEventListener('backbutton', fn)
}
const quit = function () {
  plus.runtime.quit()
}
module.exports = {backReady, quit}
