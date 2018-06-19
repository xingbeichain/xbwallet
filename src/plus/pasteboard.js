/* eslint-disable */
const pasteboard = function (value) {
  const os = plus.os.name
  if (os === 'Android') {
    let Context = plus.android.importClass('android.content.Context')
    let main = plus.android.runtimeMainActivity()
    let clip = main.getSystemService(Context.CLIPBOARD_SERVICE)
    plus.android.invoke(clip, 'setText', value)
  } else {
    let UIPasteboard = plus.ios.importClass('UIPasteboard')
    let generalPasteboard = UIPasteboard.generalPasteboard()
    generalPasteboard.setValueforPasteboardType(value, 'public.utf8-plain-text')
  }
}
module.exports = pasteboard
