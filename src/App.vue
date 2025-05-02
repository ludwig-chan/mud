<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useScenesStore } from './stores/scenes'
import { onMounted } from 'vue'
import Background from './components/common/Background.vue'

const scenesStore = useScenesStore()

onMounted(() => {
  // 初始化所有场景
  scenesStore.initializeScenes()
})
</script>

<template>
  <Background />
  <RouterView />
</template>

<style scoped>
</style>
