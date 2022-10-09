import { defineStore } from 'pinia'


export const SystemStore = defineStore('SystemStore', {
  state () {
    return {
      downFiles: [],
      nowImgView: {},
      collectFiles: []
    }
  },
  getters: {
    getAllCollectFiles (state) {
      this.restCollectFiles()
      return state.collectFiles
    }
  },
  actions: {
    async setDownFiles (value) {
      this.downFiles = []
    },
    async setNowImgView (value) {
      this.nowImgView = value
    },
    restCollectFiles () {
      const getCollectFiles = window.localStorage.getItem('collectFiles')
      this.collectFiles = JSON.parse(getCollectFiles)
    },
    async setCollectFiles (value, type) {
      if (type === 'add') {
        this.collectFiles.splice(0, 0, value)
      } else {
        let index = this.collectFiles.findIndex(item => item.id === value.id);
        if (index > -1) {
          this.collectFiles.splice(index, 1)
        }
      }
      // todo  开发阶段先用缓存   后续修改
      window.localStorage.setItem('collectFiles', JSON.stringify(this.collectFiles))
    },
  },
})
