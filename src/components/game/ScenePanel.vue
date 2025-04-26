<template>
  <div class="scene-panel">
    <div class="scene-options">
      <span
        v-for="scene in scenes"
        :key="scene.id"
        class="scene-option"
        :class="{ active: modelValue === scene.id }"
        @click="emit('update:modelValue', scene.id)"
      >
        {{ scene.name }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Scene {
  id: string;
  name: string;
}

defineProps<{
  modelValue: string;
  scenes: Scene[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>

<style scoped>
.scene-panel {
  width: 100%;
  padding: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.scene-options {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.scene-option {  cursor: pointer;
  padding: 4px 12px;
  color: #666;
  transition: color 0.3s;
  user-select: none;
}

.scene-option:hover {
  color: #000;
}

.scene-option.active {
  color: #000;
  font-weight: bold;
}
</style>
