<template>
  <section class="actions-panel">
    <div class="action-buttons">
      <ActionButton
        :duration="5"
        @click="handleChopWood"
        :disabled="equipment.axeCount === 0"
        :tooltip="'需要斧头才能砍伐'"
      >
        砍伐
      </ActionButton>
      <ActionButton :duration="3" @click="handleGatherFruit"> 采集 </ActionButton>
      <ActionButton :duration="3" @click="resources.mineOre"> 采矿 </ActionButton>
      <ActionButton
        :duration="10"
        @click="craftAxe"
        :disabled="resources.branch.count < 3 || resources.ore.count < 2"
        :tooltip="'需要：树枝x3 矿石x2'"
      >
        打造斧头
      </ActionButton>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useResourcesStore } from "../../stores/resources";
import { useEquipmentStore } from "../../stores/equipment";
import { gameLog } from "../../utils/eventBus";
const resources = useResourcesStore();
const equipment = useEquipmentStore();

const handleGatherFruit = async () => {
  const result = await resources.gather();
  switch (result.type) {
    case "fruit":
      if (result.fruit) {
        // 使用 resources store 中统一定义的物品名称
        const item = resources.displayableItems.find(item => item.id === result.fruit);
        if (item) {
          gameLog({ text: `采集到了一个${item.label}！`, type: "ITEM" });
        }
      }
      break;
    case "branch":
      gameLog({ text: "发现了一根结实的树枝！", type: "ITEM" });
      break;
    case "ore":
      gameLog({ text: "在草丛中发现了一块矿石！", type: "ITEM" });
      break;
  }
};


const handleChopWood = async () => {
  await resources.chopWood();
};

const craftAxe = async () => {
  if (!(await resources.craftAxe())) {
    gameLog({ text: "资源不足！需要 3 根树枝和 2 个矿石来打造斧头", type: "SYSTEM" });
  }
};
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
