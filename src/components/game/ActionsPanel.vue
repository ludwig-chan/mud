<template>
  <section class="actions-panel">
    <div class="action-buttons">
      <ActionButton
        v-for="action in actions"
        :key="action.name"
        :duration="action.duration"
        :disabled="action.disabled"
        :tooltip="action.tooltip"
        @click="action.handler"
      >
        {{ action.text }}
      </ActionButton>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Action {
  name: string;
  text: string;
  duration: number;
  handler: () => Promise<void>;
  disabled?: boolean;
  tooltip?: string;
}

defineProps<{
  actions: Action[]
}>();
</script>

<style scoped>
.actions-panel {
  background-color: #f5f5f5;
  border-radius: 8px;
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
