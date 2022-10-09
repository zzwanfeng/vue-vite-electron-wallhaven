<template>
  <div id="app" class="app">
    <aside class="aside">
      <div class="logo">
        <img draggable="false" :src="logo" alt />
        <!-- <div>One Wallhaven</div> -->
        <div>zzh plus</div>
      </div>

      <aside-nav @selectMenu="handleSelect"></aside-nav>
    </aside>

    <main class="main">
      <div class="main-header">
        <nav-stuats :title="title"></nav-stuats>
      </div>

      <div class="component">
        <transition name="slide-fade">
          <component
            :key="component"
            :is="component"
            class="page-component"
          ></component>
        </transition>
      </div>
    </main>

    <img-view :data="view"></img-view>
    <div class="app-bg" :class="cname"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { SystemStore } from '@/store/modules/System'
import logo from '@/assets/images/logo.svg'
import AsideNav from '@/components/AsideNav/Index.vue'
import NavStuats from '@/components/NavStuats/Index.vue'
import ImgView from '@/components/ImgView/Index.vue'

import AboutPage from '@/views/AboutPage/Index.vue'
import AcgPage from '@/views/AcgPage/Index.vue'
import CollectionPage from '@/views/CollectionPage/Index.vue'
import DownloadPage from '@/views/DownloadPage/Index.vue'
import HotPage from '@/views/HotPage/Index.vue'
import PeoplePage from '@/views/PeoplePage/Index.vue'

const SystemPinia = SystemStore()
const view = ref({})
SystemPinia.$subscribe(
  (mutation, state) => {
    if (state?.nowImgView?.url) {
      view.value = state.nowImgView
    }
  },
  { detached: false }
)

let title = ref('热门推荐')
let component = ref(HotPage)
let cname = ref('HotPage')
const include = ['people', 'acg', 'hot']

const handleSelect = (value) => {
  console.log('value', value)
  title.value = value.title
  component.value = value.component
  cname.value = value.cname
}

const handleImgView = (value) => {
  console.log('value', value)
}
</script>

<style lang="scss" scoped>
.app {
  font-size: 12px;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  box-shadow: 8px 8px 10px grey;

  .aside {
    width: 260px;
    background-color: #201f2908;
    box-shadow: -10px 0 20px 0px #000000c4;
    color: #fff;

    .logo {
      -webkit-app-region: no-drag;
      text-align: center;
      font-size: 20px;
      line-height: 30px;
      font-weight: 700;
      img {
        width: 120px;
        margin-top: 30px;
      }
    }
  }

  .main {
    flex: 1;
    overflow: hidden;

    .main-header {
      height: 40px;
      color: #fff;
    }

    .component {
      height: calc(100% - 40px);
      position: relative;

      .page-component {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
      }
    }
  }

  .app-bg {
    position: absolute;
    width: 100vw;
    height: 100vh;
    background-color: #0c0e29;
    background-image: url(@/assets/images/bg.jpg);
    background-size: 100% 100%;
    top: 0;
    left: 0;
    z-index: -1;
    transition: background 0.8s;

    &.CollectionPage,
    &.PeoplePage {
      background-image: url(@/assets/images/people-bg.png);
    }

    &.HotPage,
    &.DownloadPage {
      background-image: url(@/assets/images/down-bg.jpg);
    }

    &.AcgPage,
    &.AboutPage {
      background-image: url(@/assets/images/sc-bg.png);
    }
    &::before {
      content: '';
      position: absolute;
      width: 100vw;
      height: 100vh;
      top: 0;
      left: 0;
      backdrop-filter: blur(20px);
    }
  }
}

.slide-fade-leave-active,
.slide-fade-enter-active {
  transition: all 0.8s ease;
}

.slide-fade-enter,
.slide-fade-leave-to {
  overflow: hidden;
  transform: scale(0.1) translateY(-600px);
  opacity: 0;
}

.slide-fade-leave-to {
  position: absolute;
}
</style>