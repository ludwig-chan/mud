<template>
  <main class="game-container">
    <header class="header">
      <GameDateTime />
      <PlayerStatus />
    </header>
    <div class="middle-section">
      <OperationArea />
    </div>
    <footer class="footer">
      <GameFeed />
    </footer>
  </main>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useTimeStore } from '@/stores/time'
import GameFeed from '@/components/game/GameFeed.vue'
import GameDateTime from '@/components/game/GameDateTime.vue'
import PlayerStatus from '@/components/game/PlayerStatus.vue'
import OperationArea from '@/components/game/OperationArea.vue'

const timeStore = useTimeStore()

// 当进入游戏页面时启动时间系统
onMounted(() => {
  timeStore.startTime()
})

// 当离开游戏页面时停止时间系统
onUnmounted(() => {
  timeStore.stopTime()
})
</script>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  padding: 1rem;
  gap: 1rem;
}

.header {
  flex: 0 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
}

.middle-section {
  height: calc(100vh - 200px - 32px * 2 - 58px);
  display: flex;
  overflow: auto;
  gap: 1rem;
}

.footer {
  flex: 0 0 180px;
  width: 100%;
  height: 180px;
}
</style>
