/* eslint-disable */
const saveimg = function (img) {
  const bitmap = new plus.nativeObj.Bitmap()
  bitmap.loadBase64Data(img, function () {
    console.log('创建成功')
    bitmap.save('_downloads/images/qrcode.jpg', {overwrite: true}, function () {
      console.log('保存成功')
      plus.gallery.save('_downloads/images/qrcode.jpg', function () {
        console.log('保存图片到相册成功')
      }, function () {
        console.log('保存图片到相册失败')
      })
    }, function () {
      console.log('保存失败')
    })
  }, function () {
    console.log('创建失败')
  })

}
module.exports = saveimg
