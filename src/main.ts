import './assets/main.css'
import './assets/tooltip.css'
import { registerSW } from 'virtual:pwa-register'

registerSW({ immediate: true })

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

// 禁用移动端下拉刷新
document.addEventListener('touchmove', (e) => {
  if (document.documentElement.scrollTop === 0) {
    e.preventDefault()
  }
}, { passive: false })

// 注册 tooltip 指令
import tooltip from './directives/tooltip'
app.directive('tooltip', tooltip)

app.mount('#app')
