import { defineStore } from 'pinia'
import { downFile } from '@/utils/downfile'
import { getTime } from '@/utils/util'

export const SystemStore = defineStore('SystemStore', {
  state () {
    return {
      downFiles: [],
      downDoneFiles: [],
      nowImgView: {},
      collectFiles: []
    }
  },
  getters: {
    getAllCollectFiles (state) {
      this.restCollectFiles()
      return state.collectFiles
    },
    getAllDownFiles (state) {
      this.restDownFiles()
      return state.downFiles
    },
    getAllDownDoneFiles (state) {
      this.restDownDoneFiles()
      return state.downDoneFiles
    }
  },
  actions: {
    // 下载文件
    async setDownFiles (value, type = 'add') {
      if (type === 'add') {
        let index = this.downFiles.findIndex(item => item.id === value.id);
        if (index === -1) {
          value.progress = 0;
          value.speedBytes = 0;
          value.state = 'wait';
          value.done = "downing";
          this.downFiles.splice(0, 0, value)
          downFile(value)
        }
      } else {
        let index = this.downFiles.findIndex(item => item.id === value.id);
        if (index > -1) {
          this.downFiles.splice(index, 1)
        }
      }
      // todo  开发阶段先用缓存   后续修改
      window.localStorage.setItem('downFiles', JSON.stringify(this.downFiles))
    },
    // 更新状态
    setDownState (data) {
      let { id, done, progress } = data;
      let index = this.downFiles.findIndex(item => item.id === id)
      if (done === 'end') {
        if (progress === 100) {
          let { id, path, resolution, size, small, url } = data
          this.downDoneFiles.splice(0, 0, { id, path, resolution, size, small, url, downloadtime: getTime() })
          if (index > -1) this.downFiles.splice(index, 1)
        }
      } else {
        if (index > -1) {
          this.downFiles[index] = data
        }
      }
      // todo  开发阶段先用缓存   后续修改
      window.localStorage.setItem('downFiles', JSON.stringify(this.downFiles))
      window.localStorage.setItem('downDoneFiles', JSON.stringify(this.downDoneFiles))
    },
    restDownFiles () {
      const getDownFiles = window.localStorage.getItem('downFiles')
      if (getDownFiles) {
        this.downFiles = JSON.parse(getDownFiles)
      }
    },
    async setDownDoneFiles (value, type) {
      if (type === 'add') {
        this.downDoneFiles.splice(0, 0, value)
      } else {
        let index = this.downDoneFiles.findIndex(item => item.id === value.id);
        if (index > -1) {
          this.downDoneFiles.splice(index, 1)
        }
      }
      // todo  开发阶段先用缓存   后续修改
      window.localStorage.setItem('downDoneFiles', JSON.stringify(this.downDoneFiles))
    },
    restDownDoneFiles () {
      const getDownDoneFiles = window.localStorage.getItem('downDoneFiles')
      if (getDownDoneFiles) {
        this.downDoneFiles = JSON.parse(getDownDoneFiles)
      }
    },
    async setNowImgView (value) {
      this.nowImgView = value
    },
    restCollectFiles () {
      const getCollectFiles = window.localStorage.getItem('collectFiles')
      if (getCollectFiles) {
        this.collectFiles = JSON.parse(getCollectFiles)
      }
    },
    async setCollectFiles (value, type) {
      console.log('collectFiles', this.collectFiles)
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
