import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App);

import router from './router'
// import './router/permission'

import { createPinia } from 'pinia'
const pinia = createPinia()

import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

import '@/assets/style/index.scss'

app.use(router).use(pinia).use(ElementPlus, { locale: zhCn }).mount('#app')
