<template>
  <section class="actions-panel">
    <div class="action-buttons">
      <ActionButton
        :duration="5"
        @click="handleChopWood"
        :preCondition="() => resources.axeCount > 0"
        :tooltip="'需要斧头才能砍伐'"
      >
        砍伐
      </ActionButton>
      <ActionButton :duration="3" @click="handleGatherFruit" mobile> 采集 </ActionButton>
      <ActionButton :duration="3" @click="resources.mineOre" mobile> 采矿 </ActionButton>
      <ActionButton
        :duration="10"
        @click="craftAxe"
        :preCondition="() => resources.wood >= 3 && resources.ore >= 2"
        mobile
        :tooltip="'需要：木材x3 矿石x2'"
      >
        打造斧头
      </ActionButton>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useResourcesStore } from "../../stores/resources";
import { gameLog } from "../../utils/eventBus";

const resources = useResourcesStore();

const fruitNames = {
  apple: "苹果",
  banana: "香蕉",
  watermelon: "西瓜",
  durian: "榴莲",
};

const handleGatherFruit = async () => {
  const result = await resources.gather();
  switch (result.type) {
    case "fruit":
      if (result.fruit) {
        const fruitName = fruitNames[result.fruit];
        gameLog({ text: `采集到了一个${fruitName}！`, type: "ITEM" });
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

const handleEatFruit = async (
  fruitType: "apple" | "banana" | "watermelon" | "durian"
) => {
  const result = await resources.eatFruit(fruitType);
  if (result.success) {
    const fruitName = fruitNames[fruitType];
    let message = `食用了一个${fruitName}，饱食度+${result.satietyGained}`;
    if (result.gotSeed) {
      message += `，并且得到了一颗${fruitName}种子！`;
    } else {
      message += "！";
    }
    gameLog({ text: message, type: "ACTION" });
  }
};

const handleChopWood = async () => {
  await resources.chopWood();
};

const craftAxe = async () => {
  if (!(await resources.craftAxe())) {
    gameLog({ text: "资源不足！需要 3 个木材和 2 个矿石来打造斧头", type: "SYSTEM" });
  }
};
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
