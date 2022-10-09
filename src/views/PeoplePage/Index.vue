<template>
  <div>
    <search-list
      :total="total"
      @search="handleSearch"
      :purity="search.purity"
      :sorting="search.sorting"
    ></search-list>

    <img-list :list="list" :skeleton="skeleton" @next="next"></img-list>
  </div>
</template>

<script setup>
import ImgList from '@/components/ImgList/Index.vue'
import SearchList from '@/components/SearchList/Index.vue'
import useImagePage from '@/hooks/useImagePage'

let search = {
  categories: '001',
  purity: ['SFW'],
}

const { skeleton, page, isLoading, list, total, next, handleSearch, getlist } =
  useImagePage()

getlist(search)
</script>