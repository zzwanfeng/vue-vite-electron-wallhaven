<template>
  <ul ref="imglist" class="imglist" id="asd">
    <template v-if="skeleton">
      <li v-for="item in 12" :key="item" class="skeleton">
        <div class="img"></div>
        <div class="desc">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </li>
    </template>

    <template v-else>
      <template v-if="list.length > 0">
        <li
          v-for="(item, index) in list"
          :key="item.id + index"
          @contextmenu.prevent="openMenu($event)"
        >
          <div class="img">
            <img
              @error="handleError"
              loading="lazy"
              draggable="false"
              :src="item.thumbs.small"
              @click="handleView(item)"
            />
            <div class="img-info">
              <span>{{ byte(item.file_size) }}</span>
              <span>{{ item.file_type }}</span>
            </div>
          </div>

          <div class="desc">
            <span
              :key="item.id + 'cxx'"
              v-if="getCollection(item.id)"
              @click="handleRemoveCollection(item)"
              class="iconfont icon-collection-b shoucang"
            ></span>

            <span
              :key="item.id + 'cx'"
              v-else
              @click="handleAddCollection(item)"
              class="iconfont icon-collection-b"
            ></span>

            <span>{{ item.resolution }}</span>

            <span @click="handleSetWallpaper(item)">设为壁纸</span>

            <!-- <span @click="handleSetWallpaper(item)">设为锁屏</span> -->

            <span @click="handleDownFile(item)">下载</span>
          </div>
        </li>
      </template>

      <template v-else>
        <empty-page title="未找到图片信息~"></empty-page>
      </template>
    </template>

    <!-- todo 右键操作 -->
    <!-- <context-menu class="right-menu" :offset="menuOffset">
            <template v-slot:menuItem>
                <li>收藏</li>
                <li>下载</li>
                <li>查看</li>
            </template>
        </context-menu>-->
  </ul>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, reactive, computed } from 'vue'
import errimg from '@/assets/images/errimg.svg'
import { SystemStore } from '@/store/modules/System'
import { ElMessage } from 'element-plus'
import { byte } from '@/utils/util'
import EmptyPage from '@/components/EmptyPage/Index.vue'

const wallpaper = require('wallpaper')

const edge = require('electron-edge-js')
var handleSetWallpaper = edge.func(`
    using System.Threading.Tasks;
    using System.Runtime.InteropServices;

    public class Startup
    {
        public async Task<object> Invoke(object input)
        {
            string v = (string)input;
            return SystemParametersInfo(20, 1, v, 1);
        }
        [DllImport("user32.dll", EntryPoint = "SystemParametersInfo")]
	    public static extern int SystemParametersInfo(
            int uAction,
            int uParam,
            string lpvParam,
            int fuWinIni
        );
    }
`)

const SystemPinia = SystemStore()

let wallpaperId = ref(null)
SystemPinia.$subscribe(
  async (mutation, state) => {
    if (state.downDoneFiles && state.downDoneFiles.length > 0) {
      const wallpaperValue = state.downDoneFiles.find(
        (res) => res.id === wallpaperId.value
      )
      if (wallpaperValue) {
        // var start = new Date().getTime()
        // console.log('start', start)

        // 方法一:使用wallpaper插件
        // console.log('11', wallpaper.get())
        // wallpaper.set('c:\\windows\\web\\wallpaper\\theme1\\img2.jpg', {
        //   screen: 'all',
        //   scale: 'auto',
        // })
        // wallpaper.set(item.path, { screen: 'all', scale: 'auto' })

        // 方法二:使用electron-edge-js插件
        await setWallPaper(wallpaperValue.path, true, function (err, val) {
          if (err) {
            console.log('err', err)
            throw err
          } else {
            console.log('val', val)
            return val
          }
        })
        wallpaperId.value = null
        // var end = new Date().getTime()
        // console.log('end', end)
        // console.log('cost is', `${end - start}ms`)
      }
    }
  },
  { detached: false }
)

const { skeleton, list } = defineProps({
  skeleton: Boolean,
  list: Array,
})

const emit = defineEmits()

let pageScrollTop = ref(0)
// todo 右键操作
// let menuOffset = reactive({
//   offsetLeft: 0,
//   offsetWidth: 0,
//   clientX: 0,
//   clientY: 0,
// })

const handleError = (e) => {
  e.target.src = errimg
}

// 列表滚动
const handlerScroll = (e) => {
  let { scrollHeight, clientHeight, scrollTop } = e.target
  pageScrollTop.value = scrollTop

  if (scrollHeight < scrollTop + clientHeight + 50) {
    emit('next')
  }
}

onMounted(() => {
  window.addEventListener('scroll', handlerScroll, true)
})
onUnmounted(() => {
  // 离开该页面需要移除这个监听的事件，不然会报错
  window.removeEventListener('scroll', handlerScroll, true)
})
watch(
  () => top.value,
  (pev, old) => {
    window.addEventListener('scroll', handlerScroll, true)
  }
)

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

// 获取收藏状态
const getCollection = (id) => {
  let collections = SystemPinia?.getAllCollectFiles ?? []
  const isShow =
    collections.length > 0 &&
    collections.findIndex((item) => id == item.id) !== -1
  return isShow
}

//查看
const handleView = async (item) => {
  await SystemPinia.setNowImgView({ ...item })
}

// 下载
const handleDownFile = async (item) => {
  return new Promise((resolve, reject) => {
    let {
      id,
      path: url,
      file_size: size,
      resolution,
      thumbs: { small },
    } = item

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

    ElMessage({
      message: '已加入下载',
      type: 'success',
      duration: 2000,
    })
    setTimeout(async () => {
      await SystemPinia.setDownFiles(obj)
      resolve()
    }, 1000)
  })
}

// todo 右键操作
const openMenu = (e, data) => {
  // this.menuOffset.offsetLeft = this.$el.getBoundingClientRect().left // container margin left
  // this.menuOffset.offsetWidth = this.$el.offsetWidth // container width
  // this.menuOffset.clientX = e.clientX
  // this.menuOffset.clientY = e.clientY
}

const setWallpaper = async (item) => {
  await handleDownFile(item).then((res) => {
    ElMessage({
      message: '正在更换壁纸',
      type: 'success',
      duration: 2000,
    })

    wallpaperId.value = item.id
  })
}
</script>

<style lang="scss" scoped>
.imglist {
  height: 100%;
  list-style: none;
  padding-left: 20px;
  overflow-y: auto;
  text-align: center;
  li {
    margin: 10px;
    width: 300px;
    height: 240px;
    border-radius: 3px;
    overflow: hidden;
    display: inline-block;
    transition: transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02), 0 4px 8px #00000042;
    position: relative;
    z-index: 1;

    &:hover {
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02), 0 16px 32px -4px #000000a3;
      transform: translateY(-5px);
    }

    &::before {
      content: '';
      height: 150%;
      width: 150%;
      position: absolute;
      background: rgba(0, 0, 0, 0.205);
      left: -25%;
      top: -25%;
      filter: blur(50px);
      z-index: -1;
    }

    .img {
      position: relative;
      width: 300px;
      height: 200px;

      img {
        display: block;
        width: 100%;
        height: 100%;
      }

      .img-info {
        top: 0;
        position: absolute;
        width: 100%;
        box-sizing: border-box;
        line-height: 30px;
        background: #00000099;
        position: absolute;
        color: #ffffffa8;
        display: flex;
        justify-content: space-between;
        padding: 0 10px;
        transform: translateY(-100%);
        transition: transform 0.4s;
      }

      &:hover {
        .img-info {
          transform: translateY(0);
        }
      }
    }

    .desc {
      line-height: 40px;
      height: 40px;
      background: #1e2336;
      color: #888888;
      font-size: 12px;
      padding: 0 10px;
      display: flex;
      justify-content: space-between;

      .shoucang {
        color: #38acfa;
      }
    }
  }

  .skeleton {
    .desc {
      align-items: center;

      span {
        display: inline-block;
        width: 30%;
        height: 20px;
        background: linear-gradient(
          60deg,
          #ffffff17 25%,
          #e2e2e217 37%,
          #e4e4e41f 63%
        );
        background-size: 400% 100%;
        animation: skeleton-loading 1.4s ease infinite;
      }

      @keyframes skeleton-loading {
        0% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0 50%;
        }
      }
    }
  }
}
</style>