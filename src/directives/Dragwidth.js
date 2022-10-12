export default (app) => {
  app.directive('dragwidth', {
    mounted (el, binding, vnode) {
      let odiv = el
      let x = 0
      let y = 0
      let l = 0
      let t = 0
      let isDown = false

      odiv.onmousedown = function (e) {
        if (e.button === 0) {
          //获取x坐标和y坐标
          x = e.clientX
          y = e.clientY
          //获取左部和顶部的偏移量
          l = odiv.offsetLeft
          t = odiv.offsetTop
          isDown = true

          document.onmousemove = function (e) {
            if (isDown) {
              let nx = e.clientX
              let ny = e.clientY
              odiv.style.left = nx - (x - l) + 'px'
              odiv.style.top = ny - (y - t) + 'px'
            }
          }

          document.onmouseup = function () {
            isDown = false

            document.onmousemove = null
            document.onmouseup = null
          }
        }
      }
    },
  })
}