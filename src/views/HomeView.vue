<template>
  <main class="game-container">
    <ActionsPanel />
    <InfoPanel />
    <GameFeed />
  </main>
</template>

<script setup lang="ts">
import ActionsPanel from '@/components/ActionsPanel.vue'
import InfoPanel from '@/components/InfoPanel.vue'
import GameFeed from '@/components/GameFeed.vue'
</script>

<style scoped>
.game-container {
  display: grid;
  grid-template-columns: 250px 1fr 300px;
  grid-template-rows: 1fr 200px;
  gap: 1rem;
  height: 100vh;
  padding: 1rem;
}

:deep(.actions-panel) {
  grid-column: 1;
  grid-row: 1;
}

:deep(.info-panel) {
  grid-column: 3;
  grid-row: 1;
}

:deep(.game-feed) {
  grid-column: 1 / -1;
  grid-row: 2;
}
</style>
