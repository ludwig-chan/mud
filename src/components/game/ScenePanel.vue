<template>
  <div class="scene-panel">
    <div class="scene-options">
      <span
        v-for="scene in scenes"
        :key="scene.id"
        class="scene-option"
        :class="{ active: currentScene === scene.id }"
        @click="selectScene(scene)"
      >
        {{ scene.name }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Scene {
  id: string
  name: string
}

const currentScene = ref('grassland')

const scenes: Scene[] = [
  { id: 'grassland', name: '草原' },
  { id: 'forest', name: '树林' },
  { id: 'mountain', name: '山脉' },
  { id: 'lake', name: '湖泊' }
]

const selectScene = (scene: Scene) => {
  currentScene.value = scene.id
  console.log('选择场景:', scene.name)
}
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

.scene-option {
  cursor: pointer;
  padding: 4px 12px;
  color: #ccc;
  transition: color 0.3s;
}

.scene-option:hover {
  color: #fff;
}

.scene-option.active {
  color: #fff;
  font-weight: bold;
}
</style>
