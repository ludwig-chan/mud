<template>
  <div class="operation-area">
    <ScenePanel
      v-model="currentScene"
      :scenes="scenes"
    />    <div class="operation-bottom">
      <InfoPanel :items="currentResources" />
      <ActionsPanel :actions="currentActions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import InfoPanel from './InfoPanel.vue';
import ActionsPanel from './ActionsPanel.vue';
import ScenePanel, { type Scene } from './ScenePanel.vue';
import { useEquipmentStore } from "../../stores/equipment";
import { gameLog } from "../../utils/eventBus";

const equipment = useEquipmentStore();

interface GameAction {
  name: string;
  text: string;
  duration: number;
  handler: () => Promise<void>;
  disabled?: boolean;
  tooltip?: string;
}

interface GameResource {
  id: string;
  type: 'wood' | 'ore' | 'branch';
  name: string;
  count: number;
  maxCount?: number;
}

interface GameScene extends Scene {
  actions: GameAction[];
  resources: GameResource[];
}

const currentScene = ref('base');
const scenes: GameScene[] = [
  {
    id: 'base',
    name: '基地',    resources: [
      { id: 'wood', type: 'wood', name: '木材', count: 0 },
      { id: 'ore', type: 'ore', name: '矿石', count: 0 },
      { id: 'branch', type: 'branch', name: '树枝', count: 0 }
    ],
    actions: [{
      name: 'craftAxe',
      text: '打造斧头',
      duration: 10,
      handler: async () => {
        const scene = scenes.find(s => s.id === currentScene.value);
        if (!scene) return;
        
        const branchResource = scene.resources.find(r => r.type === 'branch');
        const oreResource = scene.resources.find(r => r.type === 'ore');
        
        if (!branchResource || !oreResource) {
          gameLog({ text: "资源类型错误", type: "SYSTEM" });
          return;
        }

        if (branchResource.count >= 3 && oreResource.count >= 2) {
          branchResource.count -= 3;
          oreResource.count -= 2;
          equipment.craftAxe({ branch: 3, ore: 2 });
          gameLog({ text: "成功打造了一把斧头！", type: "ITEM" });
        } else {
          gameLog({ text: "资源不足，无法打造斧头", type: "SYSTEM" });
        }
      },
      get disabled() {
        const scene = scenes.find(s => s.id === currentScene.value);
        if (!scene) return true;
        
        const branchResource = scene.resources.find(r => r.type === 'branch');
        const oreResource = scene.resources.find(r => r.type === 'ore');
        
        return !branchResource || !oreResource || branchResource.count < 3 || oreResource.count < 2;
      },
      tooltip: '需要：树枝x3 矿石x2'
    }]
  },
  {
    id: 'forest',
    name: '树林',    resources: [
      { id: 'wood', type: 'wood', name: '木材', count: 0, maxCount: 100 },
      { id: 'ore', type: 'ore', name: '矿石', count: 0, maxCount: 50 },
      { id: 'branch', type: 'branch', name: '树枝', count: 0, maxCount: 200 }
    ],
    actions: [
      {
        name: 'chopWood',
        text: '砍伐',
        duration: 5,
        handler: async () => {
          const scene = scenes.find(s => s.id === currentScene.value);
          if (!scene) return;
          
          const woodResource = scene.resources.find(r => r.type === 'wood');
          if (woodResource && woodResource.count < (woodResource.maxCount || Infinity)) {
            woodResource.count++;
            gameLog({ text: "获得了一个木材", type: "ITEM" });
          } else {
            gameLog({ text: "该区域的木材已经达到上限", type: "SYSTEM" });
          }
        },
        disabled: equipment.axeCount === 0,
        tooltip: '需要斧头才能砍伐'
      },
      {
        name: 'explore',
        text: '探索',
        duration: 3,
        handler: async () => {
          const scene = scenes.find(s => s.id === currentScene.value);
          if (!scene) return;
          
          const branchResource = scene.resources.find(r => r.type === 'branch');
          if (branchResource && branchResource.count < (branchResource.maxCount || Infinity)) {
            const amount = Math.floor(Math.random() * 2) + 1; // 随机获得1-2个树枝
            branchResource.count += amount;
            gameLog({ text: `探索发现了${amount}个树枝`, type: "ITEM" });
          } else {
            gameLog({ text: "该区域的树枝已经达到上限", type: "SYSTEM" });
          }
        }
      },
      {
        name: 'mineOre',
        text: '采矿',
        duration: 3,
        handler: async () => {
          const scene = scenes.find(s => s.id === currentScene.value);
          if (!scene) return;
          
          const oreResource = scene.resources.find(r => r.type === 'ore');
          if (oreResource && oreResource.count < (oreResource.maxCount || Infinity)) {
            oreResource.count++;
            gameLog({ text: "获得了一块矿石", type: "ITEM" });
          } else {
            gameLog({ text: "该区域的矿石已经达到上限", type: "SYSTEM" });
          }
        }
      }
    ]
  }
];

// 监听场景变化
watch(currentScene, (newScene) => {
  console.log('选择场景:', scenes.find(s => s.id === newScene)?.name);
});

// 获取当前场景的资源列表
const currentResources = computed(() => {
  const scene = scenes.find(s => s.id === currentScene.value);
  return scene?.resources || [];
});

// 根据当前场景获取对应的动作列表
const currentActions = computed(() => {
  const scene = scenes.find(s => s.id === currentScene.value);
  return scene?.actions || [];
});
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
