<template>
  <section class="info-panel">
    <h2>个人信息</h2>
    <Tabs v-model="activeTab" :tabs="tabs">
      <template #inventory>
        <div class="inventory">
          <ul class="resources-list">
            <li>木材: {{ resources.wood }}</li>
            <li>矿石: {{ resources.ore }}</li>
            <li class="resource-group">
              果实:
              <ul class="sub-resources">
                <li v-if="resources.fruits.apple" class="resource-item">
                  <span>苹果: {{ resources.fruits.apple }}</span>
                  <button @click="handleEatFruit('apple')" class="eat-button">食用</button>
                </li>
                <li v-if="resources.fruits.banana" class="resource-item">
                  <span>香蕉: {{ resources.fruits.banana }}</span>
                  <button @click="handleEatFruit('banana')" class="eat-button">食用</button>
                </li>
                <li v-if="resources.fruits.watermelon" class="resource-item">
                  <span>西瓜: {{ resources.fruits.watermelon }}</span>
                  <button @click="handleEatFruit('watermelon')" class="eat-button">食用</button>
                </li>
                <li v-if="resources.fruits.durian" class="resource-item">
                  <span>榴莲: {{ resources.fruits.durian }}</span>
                  <button @click="handleEatFruit('durian')" class="eat-button">食用</button>
                </li>
              </ul>
            </li>
            <li class="resource-group">
              种子:
              <ul class="sub-resources">
                <li v-if="resources.seeds.apple">苹果种子: {{ resources.seeds.apple }}</li>
                <li v-if="resources.seeds.banana">香蕉种子: {{ resources.seeds.banana }}</li>
                <li v-if="resources.seeds.watermelon">西瓜种子: {{ resources.seeds.watermelon }}</li>
                <li v-if="resources.seeds.durian">榴莲种子: {{ resources.seeds.durian }}</li>
              </ul>
            </li>
          </ul>
        </div>
      </template>
      <template #equipment>
        <div class="equipment">
          <ul class="resources-list">
            <li v-if="resources.axe > 0">
              斧头: {{ resources.axe }}
              <span class="equipment-stats">效率加成：+50%</span>
            </li>
            <li v-else class="empty-equipment">暂无装备</li>
          </ul>
        </div>
      </template>
      <template #status>
        <div class="status">
          <p>暂无状态信息</p>
        </div>
      </template>
    </Tabs>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useResourcesStore } from '../stores/resources'
import { gameLog } from '../utils/eventBus'
import Tabs from './Tabs.vue'

const resources = useResourcesStore()
const activeTab = ref('inventory')

const handleEatFruit = async (fruitType: 'apple' | 'banana' | 'watermelon' | 'durian') => {
  const result = await resources.eatFruit(fruitType)
  if (result.success) {
    const fruitNames = {
      apple: '苹果',
      banana: '香蕉',
      watermelon: '西瓜',
      durian: '榴莲'
    }
    const fruitName = fruitNames[fruitType]
    let message = `食用了一个${fruitName}`
    if (result.gotSeed) {
      message += `，并且得到了一颗${fruitName}种子！`
    } else {
      message += '！'
    }
    gameLog(message)
  }
}
const tabs = [
  { key: 'inventory', title: '资源' },
  { key: 'equipment', title: '装备' },
  { key: 'status', title: '状态' }
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
  border-radius: 4px;  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
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
