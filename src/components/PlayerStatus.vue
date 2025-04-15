<template>
  <div class="player-status">
    <div class="status-item">
      <span class="label">体力:</span>
      <div class="progress-bar">
        <div 
          class="progress" 
          :style="{ width: `${energy}%` }"
          :class="{ 'low': energy < 30 }"
        ></div>
      </div>
      <span class="value">{{ energy }}/100</span>
    </div>

    <div class="status-item">
      <span class="label">饱腹:</span>
      <div class="progress-bar">
        <div 
          class="progress" 
          :style="{ width: `${satiety}%` }"
          :class="{ 'low': satiety < 30 }"
        ></div>
      </div>
      <span class="value">{{ satiety }}/100</span>
    </div>

    <div class="status-item">
      <span class="label">心情:</span>
      <div class="progress-bar">
        <div 
          class="progress" 
          :style="{ width: `${mood}%` }"
          :class="{ 'low': mood < 30 }"
        ></div>
      </div>
      <span class="value">{{ mood }}/100</span>
    </div>

    <div class="status-item">
      <span class="label">清洁:</span>
      <div class="progress-bar">
        <div 
          class="progress" 
          :style="{ width: `${hygiene}%` }"
          :class="{ 'low': hygiene < 30 }"
        ></div>
      </div>
      <span class="value">{{ hygiene }}/100</span>
    </div>

    <div class="status-item">
      <span class="label">体温:</span>
      <div class="progress-bar">
        <div 
          class="progress" 
          :style="{ width: `${temperature}%` }"
          :class="{ 'warning': temperature < 30 || temperature > 70 }"
        ></div>
      </div>
      <span class="value">{{ temperature }}/100</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 暂时使用简单的ref，后续可以改用store管理
const energy = ref(100)      // 体力值
const satiety = ref(100)     // 饱腹值
const mood = ref(100)        // 心情值
const hygiene = ref(100)     // 清洁度
const temperature = ref(50)  // 体温值，默认50表示适中
</script>

<style scoped>
.player-status {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
}

.label {
  font-size: 0.9rem;
  color: #666;
  width: 3em;
  text-align: right;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background-color: #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: #4CAF50;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress.low {
  background-color: #f44336;
}

.progress.warning {
  background-color: #ff9800;
}

.value {
  font-size: 0.8rem;
  color: #666;
  min-width: 4em;
}
</style>
