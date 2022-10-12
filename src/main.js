import { createApp } from 'vue'
import App from './App.vue'

import ElementPlus from 'element-plus'

import '@/style/iconfont.css';
import '@/style/index.scss';

import { store } from '@/store'

import { initPath, updateDownState } from '@/utils/downfile'
// 初始化下载目录
initPath()


import { initDirective } from './directives'


const app = createApp(App)
initDirective(app)
app.use(ElementPlus).use(store).mount('#app')


import { SystemStore } from '@/store/modules/System'
const SystemPinia = SystemStore()
updateDownState(SystemPinia.setDownState);