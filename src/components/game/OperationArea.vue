<template>
  <div class="operation-area">
  <ScenePanel v-model="scenesStore.currentSceneId" :scenes="scenesList" />
    <div class="operation-bottom">
      <InfoPanel :items="scenesStore.currentResources" />
      <ActionsPanel :actions="scenesStore.currentActions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import InfoPanel from './InfoPanel.vue';
import ActionsPanel from './ActionsPanel.vue';
import ScenePanel from './ScenePanel.vue';
import { useScenesStore } from "../../stores/scenes";
import { useBaseSceneStore } from "../../stores/scenes/base";
import { useForestSceneStore } from "../../stores/scenes/forest";
import { computed } from 'vue';

const scenesStore = useScenesStore();
const baseStore = useBaseSceneStore();
const forestStore = useForestSceneStore();

// 组合所有场景信息
const scenesList = computed(() => [
  { id: baseStore.scene.id, name: baseStore.scene.name },
  { id: forestStore.scene.id, name: forestStore.scene.name }
]);
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
