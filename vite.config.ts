import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    // vueDevTools(), // 临时禁用 vue-devtools
    VitePWA({
      // 开发环境也启用
      devOptions: {
        enabled: true,
        type: 'module'
      },
      // 自动注册
      registerType: 'autoUpdate',
      // 基本配置
      manifest: {
        name: 'sunrise',
        short_name: 'sunrise',
        icons: [{
          src: '/icons/pwa.png',
          sizes: '256x256',
          type: 'image/png'
        }]
      },
      // 工作区配置
      workbox: {
        // 只缓存静态资源
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        // 不缓存 API 请求
        navigateFallback: null,
        runtimeCaching: [
          {
            // API 请求保持 NetworkOnly
            urlPattern: /^https:\/\/api\./i,
            handler: 'NetworkOnly'
          },
          {
            // 静态资源使用 StaleWhileRevalidate
            urlPattern: /\.(js|css|html|ico|png|svg)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources',
              expiration: {
                maxEntries: 200,  // 最多缓存200个资源
                maxAgeSeconds: 30 * 24 * 60 * 60  // 缓存30天
              }
            }
          }
        ]
      }
    }),
  ],
  server: {
    port: 5174,
  },
  base: '/sunrise/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
