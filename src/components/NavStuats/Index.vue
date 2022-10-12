<template>
  <div class="title-opt">
    {{ title }}
    <span
      class="opt-btn iconfont icon-guanbi"
      @click="TitleClick('close')"
    ></span>

    <span
      v-if="isMax"
      class="opt-btn iconfont icon-tuichuquanping"
      @click="TitleClick('max')"
    ></span>

    <span
      v-else
      class="opt-btn iconfont icon-quanping"
      @click="TitleClick('max')"
    ></span>

    <span
      class="opt-btn iconfont icon-zuixiaohua"
      @click="TitleClick('min')"
    ></span>
  </div>
</template>

<script setup>
import { ref } from 'vue'

let isMax = ref(false)

const { ipcRenderer } = require('electron')
const { title } = defineProps({
  title: String,
})

const TitleClick = (type) => {
  ipcRenderer.send(type)
}

ipcRenderer.on('mainWin-max', (_, status) => {
  isMax.value = status
})
</script>

<style lang="scss" scoped>
.title-opt {
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  padding: 0 20px;
  -webkit-app-region: drag;
  text-align: center;
  color: #e4e4e4;
  letter-spacing: 2px;
  font-weight: bold;
  cursor: url(../../assets/images/cursor.png);

  .opt-btn {
    font-size: 14px;
    margin-left: 20px;
    color: #b4b4b4;
    float: right;
    -webkit-app-region: no-drag;
  }
}
</style>