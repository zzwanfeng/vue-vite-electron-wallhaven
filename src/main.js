import { createApp } from 'vue'
import App from './App.vue'

import ElementPlus from 'element-plus'

import '@/style/iconfont.css';
import '@/style/index.scss';

import { store } from '@/store'

import { initPath } from '@/utils/downfile'
// 初始化下载目录
initPath()


createApp(App).use(ElementPlus).use(store).mount('#app')
