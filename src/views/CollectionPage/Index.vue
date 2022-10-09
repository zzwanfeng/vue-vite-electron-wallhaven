<template>
  <div>
    <img-list :list="collections"></img-list>
  </div>
</template>

<script setup>
import ImgList from '@/components/ImgList/Index.vue'
import { SystemStore } from '@/store/modules/System'
const SystemPinia = SystemStore()

let collections = SystemPinia.getAllCollectFiles
</script>
