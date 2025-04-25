<template>
  <div class="operation-area">
    <ScenePanel />
    <div class="operation-bottom">
      <InfoPanel />
      <ActionsPanel />
    </div>
  </div>
</template>

<script setup lang="ts">
import InfoPanel from './InfoPanel.vue'
import ActionsPanel from './ActionsPanel.vue'
import ScenePanel from './ScenePanel.vue'
</script>

<style scoped>
.operation-area {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 1rem;
}

.operation-bottom {
  display: flex;
  flex: 1;
  gap: 1rem;
}
</style>
