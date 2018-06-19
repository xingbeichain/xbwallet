/* eslint-disable */
let scans
let ws
let wo
const scan = function () {
  ws = plus.webview.currentWebview()
  wo = ws.opener()
  ws.addEventListener('show', function () {
    scans = new plus.barcode.Barcode('bcid')
    scans.start()
    scans.onmarked = onmarked
  })
  ws.show('pop-in')
}
const scanPicture = function () {
  plus.gallery.pick(function (path) {
    plus.barcode.scan(path, onmarked, function (error) {
      plus.nativeUI.alert('无法识别此图片')
    })
  }, function (err) {
    console.log('Failed: ' + err.message)
  })
}
const flash = function (open) {
  scans.setFlash(open)
}
const onmarked = function (type, result){
  if (result) {
    console.log(result)
    window.localStorage.setItem('result', result)
    scans.close()
    wo.reload(true)
    ws.close()
  }
}
module.exports = {scan, scanPicture, flash}
