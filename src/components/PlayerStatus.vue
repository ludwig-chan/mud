<template>
  <div class="player-status">
    <div class="avatar-section">
      <div class="avatar">        <!-- 使用 emoji 作为默认头像 -->
        <div class="avatar-placeholder">
          <span class="emoji">👤</span>
        </div>
      </div>
    </div>    <div class="basic-info">
      <div class="info-item name">{{ characterName }}</div>
      <div class="info-item">{{ age }}岁 · {{ gender === '男' ? '♂' : '♀' }}</div>
    </div>    
    <div class="stats-container" @click="goToCharacterView">
      <div class="health-bar">
        <ProgressBar :value="health" label="健康" direction="vertical" color="rgb(220, 53, 69)" />
      </div>
      <div class="main-stats">
        <div class="status-item">
          <ProgressBar :value="energy" label="体力" color="rgb(0, 123, 255)" />
        </div>
        <div class="status-item">
          <ProgressBar :value="satiety" label="饱腹" color="rgb(255, 153, 0)" />
        </div>
        <div class="status-item">
          <ProgressBar :value="mood" label="心情" color="rgb(147, 112, 219)" />
        </div>
        <div class="status-item">
          <ProgressBar :value="hygiene" label="清洁" color="rgb(32, 178, 170)" />
        </div>
        <div class="status-item">
          <ProgressBar :value="mana" label="魔力" color="rgb(138, 43, 226)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ProgressBar from './ProgressBar.vue'

const router = useRouter()

// 暂时使用简单的ref，后续可以改用store管理
const characterName = ref('无名氏')  // 角色名称
const health = ref(55)     // 健康值
const energy = ref(50)      // 体力值
const satiety = ref(45)     // 饱腹值
const mood = ref(60)        // 心情值
const hygiene = ref(70)     // 清洁度
const mana = ref(0)         // 魔力值
const age = ref(18)         // 年龄
const gender = ref('男')     // 性别

const goToCharacterView = () => {
  router.push('/character')
}
</script>

<style scoped>
.player-status {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 6px;
  display: grid;
  grid-template-columns: auto auto 1fr;
  gap: 1.5rem;
  align-items: center;
}

.stats-container {
  display: flex;
  gap: 0;
  align-items: stretch;
  cursor: pointer;
  transition: transform 0.2s;
}

.stats-container:hover {
  transform: scale(1.02);
}

.health-bar {
  display: flex;
  align-items: center;
}

.avatar-section {
  flex-shrink: 0;
}

.basic-info {
  font-size: 0.9rem;
  color: #666;
  padding: 0 0.5rem;
}

.info-item.name {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.2rem;
}

.info-item {
  white-space: nowrap;
}

.avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.emoji {
  font-size: 36px;
  line-height: 1;
}

.main-stats {
  display: flex;
  flex-direction: column;
  gap: 0;
  flex-grow: 1;
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
</style>
