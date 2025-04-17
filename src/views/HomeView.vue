<template>
  <main class="game-container">    <header class="header">
      <GameDateTime />
      <PlayerStatus />
    </header>
    <div class="middle-section">
      <InfoPanel />
      <ActionsPanel />
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
import PlayerStatus from '@/components/PlayerStatus.vue'
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
  height: calc(100vh - 200px - 32px * 2 - 58px);
  display: flex;
  overflow: auto;
}

.footer {
  flex: 0 0 180px;
  width: 100%;
  height: 180px;
}
</style>
