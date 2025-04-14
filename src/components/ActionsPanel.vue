<template>
  <section class="actions-panel">
    <h2>可用操作</h2>
    <div class="action-buttons">
      <TimerButton :duration="10" @click="resources.chopWood">
        砍树
      </TimerButton>      <TimerButton :duration="10" @click="handleGatherFruit">
        采集
      </TimerButton>
      <TimerButton :duration="10" @click="resources.mineOre">
        采矿
      </TimerButton>
      <TimerButton :duration="15" @click="craftAxe" v-tooltip="'需要材料：木材x3 矿石x2'">
        打造斧头
      </TimerButton>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useResourcesStore } from '../stores/resources'

const resources = useResourcesStore()

const fruitNames = {
  apple: '苹果',
  banana: '香蕉',
  watermelon: '西瓜',
  durian: '榴莲'
}

const handleGatherFruit = async () => {
  const result = await resources.gatherFruit()
  const fruitName = fruitNames[result.fruit]
  alert(`采集到了一个${fruitName}！`)
}

const handleEatFruit = async (fruitType: 'apple' | 'banana' | 'watermelon' | 'durian') => {
  const result = await resources.eatFruit(fruitType)
  if (result.success) {
    const fruitName = fruitNames[fruitType]
    let message = `食用了一个${fruitName}`
    if (result.gotSeed) {
      message += `，并且得到了一颗${fruitName}种子！`
    } else {
      message += '！'
    }
    alert(message)
  }
}

const craftAxe = async () => {
  if (!await resources.craftAxe()) {
    alert('资源不足！需要 3 个木材和 2 个矿石来打造斧头')
  }
}
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
