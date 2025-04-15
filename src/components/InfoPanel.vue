<template>
  <section class="info-panel">
    <h2>个人信息</h2>
    <Tabs v-model="activeTab" :tabs="tabs">
      <template #inventory>
        <div class="inventory">
          <ul class="resources-list">
            <li>木材: {{ resources.wood }}</li>
            <li>矿石: {{ resources.ore }}</li>
            <li>树枝: {{ resources.branch }}</li>
            <li class="resource-group">
              果实:
              <ul class="sub-resources">
                <li v-for="fruit in availableFruits" :key="fruit.type" class="resource-item">
                  <span>{{ fruit.name }}: {{ fruit.count }}</span>
                  <button @click="handleEatFruit(fruit.type)" class="eat-button">食用</button>
                </li>
              </ul>
            </li>
            <li class="resource-group">
              种子:
              <ul class="sub-resources">
                <li v-for="seed in availableSeeds" :key="seed.type">
                  {{ seed.name }}种子: {{ seed.count }}
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </template>
      <template #equipment>
        <div class="equipment">
          <ul class="resources-list">
            <li v-if="resources.axeDurability > 0">
              斧头
              <span class="equipment-stats">
                当前耐久度：{{ resources.axeDurability % 100 || 100 }}/100
                <template v-if="resources.axeCount > 1">
                  <br>备用斧头：{{ resources.axeCount - 1 }}把
                </template>
              </span>
            </li>
            <li v-else class="empty-equipment">暂无装备</li>
          </ul>
        </div>
      </template>
    </Tabs>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useResourcesStore } from '../stores/resources'
import { gameLog } from '../utils/eventBus'
import Tabs from './Tabs.vue'
import type { FruitType } from '../stores/resources'

const resources = useResourcesStore()
const activeTab = ref('inventory')

const fruitNames: Record<FruitType, string> = {
  apple: '苹果',
  banana: '香蕉',
  watermelon: '西瓜',
  durian: '榴莲'
}

// 计算可用的水果列表
const availableFruits = computed(() => {
  const fruits: Array<{ type: FruitType; name: string; count: number }> = []
  for (const [type, count] of Object.entries(resources.fruits)) {
    if (count > 0) {
      fruits.push({
        type: type as FruitType,
        name: fruitNames[type as FruitType],
        count
      })
    }
  }
  return fruits
})

// 计算可用的种子列表
const availableSeeds = computed(() => {
  const seeds: Array<{ type: FruitType; name: string; count: number }> = []
  for (const [type, count] of Object.entries(resources.seeds)) {
    if (count > 0) {
      seeds.push({
        type: type as FruitType,
        name: fruitNames[type as FruitType],
        count
      })
    }
  }
  return seeds
})

const handleEatFruit = async (fruitType: FruitType) => {
  const result = await resources.eatFruit(fruitType)
  if (result.success) {
    let message = `食用了一个${fruitNames[fruitType]}`
    if (result.gotSeed) {
      message += `，并且得到了一颗${fruitNames[fruitType]}种子！`
    } else {
      message += '！'
    }
    gameLog(message)
  }
}

const tabs = [
  { key: 'inventory', title: '资源' },
  { key: 'equipment', title: '装备' }
]
</script>

<style scoped>
.info-panel {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 1rem;
}

h2 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: #2d3748;
}

h3 {
  margin-bottom: 0.5rem;
  font-size: 1rem;
  color: #4a5568;
}

.resources-list {
  list-style: none;
  padding: 0;
}

.resources-list li {
  margin: 0.5rem 0;
  padding: 0.5rem;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.equipment-stats {
  display: block;
  font-size: 0.9em;
  color: #4a9eff;
  margin-top: 4px;
}

.empty-equipment {
  color: #999;
  font-style: italic;
}

.resource-group {
  margin-top: 8px;
}

.sub-resources {
  list-style: none;
  margin-left: 16px;
  margin-top: 4px;
  font-size: 0.95em;
  color: #666;
}

.resource-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.eat-button {
  padding: 2px 8px;
  font-size: 0.8rem;
  background-color: #4a9eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.eat-button:hover {
  background-color: #3182ce;
}
</style>
