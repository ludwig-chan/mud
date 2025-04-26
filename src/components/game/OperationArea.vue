<template>
  <div class="operation-area">
    <ScenePanel
      v-model="currentScene"
      :scenes="scenes"
    />
    <div class="operation-bottom">
      <InfoPanel :items="inventoryItems" />
      <ActionsPanel :actions="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import InfoPanel from './InfoPanel.vue';
import ActionsPanel from './ActionsPanel.vue';
import ScenePanel, { type Scene } from './ScenePanel.vue';
import { useResourcesStore, type SubType } from "../../stores/resources";
import { useEquipmentStore } from "../../stores/equipment";
import { gameLog } from "../../utils/eventBus";

type Finding = { type: string; count: number } | { type: 'fruit'; subType: SubType; count: number };

const resources = useResourcesStore();
const equipment = useEquipmentStore();

// 场景相关逻辑
const currentScene = ref('grassland');
const scenes: Scene[] = [
  { id: 'grassland', name: '草原' },
  { id: 'forest', name: '树林' },
  { id: 'mountain', name: '山脉' },
  { id: 'lake', name: '湖泊' }
];

// 监听场景变化
watch(currentScene, (newScene) => {
  console.log('选择场景:', scenes.find(s => s.id === newScene)?.name);
});

// 物品列表计算属性
const inventoryItems = computed(() => {
  return Object.entries(resources.$state)
    .map(([id, item]) => ({
      id,
      name: item.name,
      count: item.count
    }))
    .filter(item => item.count > 0);
});

const actions = computed(() => [
  {
    name: 'chopWood',
    text: '砍伐',
    duration: 5,
    handler: async () => {
      await resources.chopWood();
    },
    disabled: equipment.axeCount === 0,
    tooltip: '需要斧头才能砍伐'
  },
  {
    name: 'explore',
    text: '探索',
    duration: 3,
    handler: async () => {
      const findings = await resources.gather();
      const messages: string[] = [];

      findings.forEach(finding => {
        if (finding.type === 'fruit' && 'subType' in finding) {
          const fruitName = resources[finding.subType].name;
          messages.push(`${fruitName} x${finding.count}`);
        } else if (finding.type === 'branch') {
          messages.push(`树枝 x${finding.count}`);
        } else if (finding.type === 'ore') {
          messages.push(`矿石 x${finding.count}`);
        }
      });

      if (messages.length > 0) {
        gameLog({ 
          text: `探索时发现了：${messages.join('、')}！`, 
          type: "ITEM" 
        });
      }
    }
  },
  {
    name: 'mineOre',
    text: '采矿',
    duration: 3,
    handler: resources.mineOre
  },
  {
    name: 'craftAxe',
    text: '打造斧头',
    duration: 10,
    handler: async () => {
      if (!(await resources.craftAxe())) {
        gameLog({ text: "资源不足！需要 3 根树枝和 2 个矿石来打造斧头", type: "SYSTEM" });
      }
    },
    disabled: resources.branch.count < 3 || resources.ore.count < 2,
    tooltip: '需要：树枝x3 矿石x2'
  }
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
