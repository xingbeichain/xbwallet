export default{
  install (Vue, options) {
    Vue.prototype.plusReady = function (fn) {
      if (window.plus) {
        setTimeout(fn, 0)
      } else {
        document.addEventListener('plusready', fn, false)
      }
    }
  }
}
