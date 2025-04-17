import './assets/main.css'
import './assets/tooltip.css'

// 注册 Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker 注册成功:', registration.scope)
      })
      .catch(error => {
        console.log('ServiceWorker 注册失败:', error)
      })
  })
}

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

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
