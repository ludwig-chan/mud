<template>
  <section class="actions-panel">
    <h2>可用操作</h2>
    <div class="action-buttons">      <TimerButton :duration="10" @click="resources.chopWood">
        砍树
      </TimerButton>
      <TimerButton :duration="10" @click="resources.gatherFruit">
        采集
      </TimerButton>
      <TimerButton :duration="10" @click="resources.mineOre">
        采矿
      </TimerButton>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useResourcesStore } from '../stores/resources'

const resources = useResourcesStore()
</script>

<style scoped>
.actions-panel {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 1rem;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #4a5568;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #2d3748;
}

button:disabled {
  background-color: #718096;
  cursor: not-allowed;
}

button:disabled:hover {
  background-color: #718096;
}
</style>
