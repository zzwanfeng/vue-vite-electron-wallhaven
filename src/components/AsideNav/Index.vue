<template>
  <ul class="nav">
    <li v-for="(item, index) in nav" :key="index">
      <div class="nav-title">{{ item.lable }}</div>
      <ul>
        <li
          :class="{ actice: actice === i.id }"
          v-for="(i, idx) in item.childer"
          :key="idx"
          @click="handleSelect(i)"
        >
          <i class="iconfont" :class="i.icon"></i>
          {{ i.lable }}
          <el-badge
            is-dot
            v-if="i.id === 'down' && downFiles.length > 0"
          ></el-badge>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { SystemStore } from '@/store/modules/System'

const emit = defineEmits()

import AboutPage from '@/views/AboutPage/Index.vue'
import AcgPage from '@/views/AcgPage/Index.vue'
import CollectionPage from '@/views/CollectionPage/Index.vue'
import DownloadPage from '@/views/DownloadPage/Index.vue'
import HotPage from '@/views/HotPage/Index.vue'
import PeoplePage from '@/views/PeoplePage/Index.vue'

const nav = [
  {
    lable: '在线壁纸',
    childer: [
      {
        id: 'hot',
        lable: '热门推荐',
        icon: 'icon-remen',
        component: HotPage,
        cname: 'HotPage',
      },
      {
        id: 'acg',
        lable: '动漫精选',
        component: AcgPage,
        cname: 'AcgPage',
        icon: 'icon-erciyuan',
      },
      {
        id: 'people',
        lable: '人物精选',
        icon: 'icon-meinv',
        component: PeoplePage,
        cname: 'PeoplePage',
      },
    ],
  },
  {
    lable: '我的壁纸',
    childer: [
      {
        id: 'my',
        lable: '我的收藏',
        icon: 'icon-collection-b',
        component: CollectionPage,
        cname: 'CollectionPage',
      },
      {
        id: 'down',
        lable: '下载中心',
        component: DownloadPage,
        cname: 'DownloadPage',
        icon: 'icon-xiazai',
      },
    ],
  },
  {
    lable: '更多',
    childer: [
      {
        id: 'about',
        lable: '关于',
        component: AboutPage,
        cname: 'AboutPage',
        icon: 'icon-guanyu',
      },
    ],
  },
]

let actice = ref('hot')

const SystemPinia = SystemStore()
const downFiles = SystemPinia?.getAllDownFiles ?? []

const handleSelect = (i) => {
  actice.value = i.id
  emit('selectMenu', {
    component: i.component,
    title: i.lable,
    cname: i.cname,
  })
}
</script>

<style lang="scss" scoped>
.nav {
  padding: 20px 30px;
  user-select: none;
  /*  -webkit-app-region: no-drag; */

  li {
    list-style: none;
    line-height: 50px;
    padding-left: 20px;
    color: #c6c6c6;
    font-size: 14px;
    position: relative;

    .nav-title {
      color: #ffffff75;
      font-size: 14px;
    }

    &:hover {
      color: #fefefe;
    }

    li {
      display: inline-block;
      padding: 0 10px;
      margin: 0 18px;

      &::before {
        content: '';
        position: absolute;
        bottom: 0;
        height: 2px;
        width: 100px;
        left: 0;
        /*  right: 0; */
        /* margin: 0 auto; */
        border-radius: 4px;
        background: linear-gradient(45deg, #0081ff, #22ebff);
        transition: transform 0.85s cubic-bezier(0.215, 0.61, 0.355, 1),
          opacity 0.85s cubic-bezier(0.215, 0.61, 0.355, 1);
        transform: scaleX(0);
        transform-origin: bottom right;
        opacity: 0;
      }

      &.actice::before {
        transform-origin: bottom left;
        transform: scaleX(1);
        opacity: 1;
        /*  animation: ttt 0.8s forwards; */
      }

      @keyframes ttt {
        0% {
          width: 10%;
        }

        100% {
          width: 100%;
        }
      }
    }
  }
}
</style>