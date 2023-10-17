<template>
  <transition name="slide">
    <div v-if="show" class="animation-content">
      <div
        class="img-view"
        ref="imgContent"
        id="imgContent"
        v-loading="loading"
      >
        <img
          v-dragwidth
          @error="handleError"
          ref="img"
          id="img"
          draggable="false"
          :width="imgSize.w"
          :height="imgSize.h"
          :src="imgUrl"
        />
        <div class="zoom-bage">{{ zoom }}</div>
      </div>
      <div class="btns">
        <div @click="handleClose" class="iconfont icon-guanbi"></div>
        <div class="iconfont icon-huifu" @click="handleRef"></div>
        <div class="iconfont icon-xiazai" @click="handleDownFile()"></div>
        <div
          v-if="getCollection(data.id)"
          @click="handleRemoveCollection(data)"
          class="iconfont icon-collection-b shoucang"
        ></div>
        <div
          v-else
          @click="handleAddCollection(data)"
          class="iconfont icon-collection-b"
        ></div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import {
  ref,
  onMounted,
  onUnmounted,
  watch,
  reactive,
  computed,
  watchEffect,
  nextTick,
} from 'vue'
import { aspectRatioToWH } from '@/utils/util'
import { getTime } from '@/utils/util'
import { getImgBlod } from '@/utils/request'
import errimg from '@/assets/images/errimg.svg'
import { ElMessage } from 'element-plus'
import { SystemStore } from '@/store/modules/System'
const SystemPinia = SystemStore()

let loading = ref(false)
let show = ref(false)
let imgUrl = ref('')
let zoom = ref(0)
let imgSize = reactive({
  w: 0,
  h: 0,
})

let clientWidth = ref(0)
let clientHeight = ref(0)
nextTick(() => {
  let { height, width } = document.documentElement.getBoundingClientRect()
  clientWidth.value = width
  clientHeight.value = height
})

let originalW = ref(0)
let minImg = ref({})

let data = ref({})
SystemPinia.$subscribe(
  (mutation, state) => {
    if (state?.nowImgView?.url) {
      data.value = state.nowImgView

      handler(data.value)
    }
  },
  { detached: false }
)

const handler = (val) => {
  let { dimension_x, dimension_y, path, ratio } = val
  show.value = true
  imgUrl.value = val.thumbs.original //先填充原图等比例的 略缩图
  const newImgSize = aspectRatioToWH(
    clientWidth.value - 100,
    clientHeight.value - 200,
    ratio,
    dimension_x,
    dimension_y
  )
  imgSize.w = newImgSize.w
  imgSize.h = newImgSize.h

  originalW.value = dimension_x
  zoom.value = parseInt((imgSize.w / dimension_x) * 100)

  minImg.value = { ...imgSize }
  loading.value = true

  // 等待动画完成后
  // setTimeout(() => {
  nextTick(() => {
    const imgDom = document.getElementById('img')
    const imgContentDom = document.getElementById('imgContent')

    imgDom.style.left = 'auto'
    imgDom.style.top = 'auto'

    imgContentDom.addEventListener('wheel', setImgWH, true)

    // 获取原始图片
    getImgBlod(path)
      .then((res) => {
        console.log('res', res)
        imgUrl.value = res
        const newImgSize = aspectRatioToWH(
          clientWidth.value - 100,
          clientHeight.value - 200,
          ratio,
          dimension_x,
          dimension_y
        )
        imgSize.w = newImgSize.w
        imgSize.h = newImgSize.h
        loading.value = false
      })
      .catch((res) => {
        //this.$message.error('图片加载失败')
        console.log(res)
        loading.value = false
      })
  })

  // }, 800)
}

//还原位置
const handleRef = () => {
  const imgDom = document.getElementById('img')
  imgDom.style.left = 'auto'
  imgDom.style.top = 'auto'

  imgSize.w = minImg.value.w
  imgSize.h = minImg.value.h
}

// 图片加载失败
const handleError = () => {
  imgUrl.value = errimg
  imgSize.w = 600
  imgSize.h = 600
}

// 获取等比高度
const setImgWH = (e) => {
  let img = document.getElementById('img')

  if (img) {
    let oX = img.offsetLeft + imgSize.w / 2
    let oY = img.offsetTop + imgSize.h / 2

    if (e.wheelDeltaY > 0) {
      imgSize.w += imgSize.w * 0.1
      imgSize.h += imgSize.h * 0.1
    } else {
      imgSize.w -= imgSize.w * 0.1
      imgSize.h -= imgSize.h * 0.1
    }

    if (imgSize.w < minImg.w) {
      imgSize.w = minImg.w
    }

    if (imgSize.h < minImg.h) {
      imgSize.h = minImg.h
    }

    img.style.left = oX - imgSize.w / 2 + 'px'
    img.style.top = oY - imgSize.h / 2 + 'px'

    zoom.value = parseInt((imgSize.w / originalW.value) * 100)
  }
}

// 关闭
const handleClose = async () => {
  show.value = false
  await SystemPinia.setNowImgView(null)
}

// 添加收藏
const handleAddCollection = async (item) => {
  await SystemPinia.setCollectFiles(item, 'add')

  ElMessage({
    message: '收藏成功',
    type: 'success',
    duration: 2000,
  })
}

// 移除收藏
const handleRemoveCollection = async (item) => {
  await SystemPinia.setCollectFiles(item, 'remove')
  ElMessage({
    message: '取消收藏',
    type: 'success',
    duration: 2000,
  })
}

// 下载
const handleDownFile = async (item = data.value) => {
  let {
    id,
    path: url,
    file_size: size,
    resolution,
    thumbs: { small },
  } = item

  // if (/^blob:/.test(imgUrl.value)) {
  //  // 方法一 ()这个方法还没处理 下载管理的数据 暂时不用)
  //   setTimeout(async () => {
  //     const a = document.createElement('a')
  //     a.href = imgUrl.value
  //     a.download = `one-${id}${url.substr(url.lastIndexOf('.'))}`
  //     a.click()
  //     setTimeout(() => {
  //       URL.revokeObjectURL(a.href)
  //       a.remove()
  //     }, 3000)

  //     SystemPinia.setDownDoneFiles(
  //       {
  //         id,
  //         resolution,
  //         size,
  //         small,
  //         url,
  //         downloadtime: getTime(),
  //       },
  //       'add'
  //     )
  //   }, 3000)

  //   ElMessage({
  //     message: '下载成功',
  //     type: 'success',
  //     duration: 2000,
  //   })
  // } else {
  // 方法二
  let obj = JSON.parse(
    JSON.stringify({
      id,
      url,
      size,
      resolution,
      small,
      _img: item,
    })
  )
  setTimeout(async () => {
    await SystemPinia.setDownFiles(obj)
  }, 1000)

  ElMessage({
    message: '已加入下载',
    type: 'success',
    duration: 2000,
  })
  // }
}

// 获取收藏状态
const getCollection = (id) => {
  let collections = SystemPinia?.getAllCollectFiles ?? []
  const isShow =
    collections.length > 0 &&
    collections.findIndex((item) => id == item.id) !== -1
  return isShow
}
</script>

<style lang="scss" scoped>
.animation-content {
  position: fixed;
  width: 100vw;
  height: 100vw;
  z-index: 9;
  backdrop-filter: blur(20px);
  overflow: hidden;

  .img-view {
    position: absolute;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      position: absolute;
    }

    .zoom-bage {
      position: absolute;
      right: 0px;
      bottom: 10px;
      font-size: 14px;
      color: #fff;
      width: 88px;
      text-align: center;
    }
  }

  .btns {
    position: absolute;
    right: 20px;
    top: 50vh;
    transform: translateY(-50%);
    color: #ffffff9e;
    z-index: 9999;

    div {
      margin: 10px 0;
      padding: 16px;
      border-radius: 50%;
      transition: all 0.3s ease;
      background: #0016484f;
      cursor: url(../../assets/images/cursor.png), auto !important;

      &:hover {
        background: #38acfa;
        color: #ffffff;
      }

      &.shoucang {
        color: #38acfa;
        &:hover {
          color: #ffffff;
        }
      }
    }
  }
}

.slide-enter-active {
  transition: all 0.5s, border-radius 0.8s 0.3s;
}
.slide-leave-active {
  transition: all 0.8s;
}

.slide-enter,
.slide-leave-to {
  opacity: 0;
  border-radius: 0 0 100vw 0;
  width: 10px;
  height: 10px;
  background: #000;
}

.slide-leave-to {
  border-radius: 0 0 0 100vw;
  right: 0;
}
</style>