import './assets/main.css'
import './assets/tooltip.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { registerSW } from 'virtual:pwa-register'

// 注册 Service Worker
const updateSW = registerSW({
  onNeedRefresh() {
    // 当有新内容时触发
    if (confirm('发现新版本，是否更新？')) {
      updateSW()
    }
  },
  onOfflineReady() {
    console.log('应用已支持离线使用')
  },
})

import App from './App.vue'
import router from './router'
import TimerButton from './components/TimerButton.vue'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.component('TimerButton', TimerButton)

// 禁用移动端长按菜单
document.addEventListener('contextmenu', (e) => {
  e.preventDefault()
  return false
})

// 注册 tooltip 指令
import tooltip from './directives/tooltip'
app.directive('tooltip', tooltip)

app.mount('#app')
