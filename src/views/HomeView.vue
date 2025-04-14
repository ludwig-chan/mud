<template>
  <main class="game-container">
    <header class="header">
      <GameDateTime />
    </header>
    <div class="middle-section">
      <ActionsPanel />
      <InfoPanel />
    </div>
    <footer class="footer">
      <GameFeed />
    </footer>
  </main>
</template>

<script setup lang="ts">
import ActionsPanel from '@/components/ActionsPanel.vue'
import InfoPanel from '@/components/InfoPanel.vue'
import GameFeed from '@/components/GameFeed.vue'
import GameDateTime from '@/components/GameDateTime.vue'
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
}

.middle-section {
  flex: 1 1 auto;
  display: flex;
  gap: 1rem;
  min-height: 0;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
}

.footer {
  flex: 0 0 200px;
  width: 100%;
}

:deep(.game-date-time) {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  border-radius: 4px;
  width: 100%;
}

:deep(.actions-panel) {
  flex: 0 0 250px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  padding: 1rem;
  overflow-y: auto;
}

:deep(.info-panel) {
  flex: 0 0 300px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  padding: 1rem;
  overflow-y: auto;
}

:deep(.game-feed) {
  height: 100%;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  padding: 1rem;
  overflow-y: auto;
  width: 100%;
}
</style>
