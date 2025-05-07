import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CharacterView from '../views/CharacterView.vue'
import SettingsView from '../views/SettingsView.vue'
import FeedView from '../views/FeedView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/character',
      name: 'character',
      component: CharacterView,
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
    },
    {
      path: '/feed',
      name: 'feed',
      component: FeedView,
    },
  ],
})

export default router
