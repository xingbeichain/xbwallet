/* eslint-disable */
const open = function (url, id, styles) {
  plus.webview.open(url, id, styles, 'slide-in-right')
}
const close = function (webview) {
  if (webview === '') {
    const ws = plus.webview.currentWebview()
    plus.webview.close(ws)
  } else {
    plus.webview.close(webview)
  }
}
const closeall = function () {
  const ws = plus.webview.currentWebview()
  const wvs = plus.webview.all()
  for (let i = 0; i < wvs.length; i++) {
    if (wvs[i].id !== ws.id) {
      wvs[i].close('none')
    }
  }
}
module.exports = {open, close, closeall}
