<template>
  <div class="character-view">
    <h1>人物属性</h1>
    <div class="character-details">      <div class="status-grid">
        <div class="status-item">
          <ProgressBar :value="energy" label="体力" />
        </div>

        <div class="status-item">
          <ProgressBar :value="satiety" label="饱腹" />
        </div>

        <div class="status-item">
          <ProgressBar :value="mood" label="心情" />
        </div>

        <div class="status-item">
          <ProgressBar :value="hygiene" label="清洁" />
        </div>

        <div class="status-item">
          <ProgressBar :value="temperature" label="体温" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProgressBar from '../components/ProgressBar.vue'

// 暂时使用简单的ref，后续可以改用store管理
const energy = ref(20)      // 体力值
const satiety = ref(20)     // 饱腹值
const mood = ref(20)        // 心情值
const hygiene = ref(20)     // 清洁度
const temperature = ref(50)  // 体温值，默认50表示适中
</script>

<style scoped>
.character-view {
  padding: 1rem;
}

.character-details {
  margin-top: 1rem;
}

.status-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.status-item {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.label {
  font-size: 0.9rem;
  color: #666;
  width: 3em;
  text-align: right;
}
</style>
