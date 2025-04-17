<template>
  <div class="player-status">
    <div class="avatar-section" @click="goToCharacterView">      <div class="avatar">
        <div class="avatar-placeholder">
          <span class="emoji">{{ character.avatar }}</span>
        </div>
      </div>
    </div>
    <div class="basic-info" @click="goToCharacterView">      <div class="info-item name">{{ character.name }}</div>
      <div class="info-item">{{ character.age }}岁 · {{ character.gender === 'male' ? '♂' : '♀' }}</div>
    </div>
    <div class="stats-container" @click="goToCharacterView">
      <div class="health-bar">
        <ProgressBar :value="character.health" label="健康" direction="vertical" color="rgb(220, 53, 69)" />
      </div>
      <div class="main-stats">
        <div class="status-item">
          <ProgressBar :value="character.energy" label="体力" color="rgb(0, 123, 255)" />
        </div>
        <div class="status-item">
          <ProgressBar :value="character.satiety" label="饱腹" color="rgb(255, 153, 0)" />
        </div>
        <div class="status-item">
          <ProgressBar :value="character.mood" label="心情" color="rgb(147, 112, 219)" />
        </div>
        <div class="status-item">
          <ProgressBar :value="character.hygiene" label="清洁" color="rgb(32, 178, 170)" />
        </div>
        <div class="status-item">
          <ProgressBar :value="character.mana" label="魔力" color="rgb(138, 43, 226)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCharacterStore } from '../stores/character'
import ProgressBar from './ProgressBar.vue'

const router = useRouter()
const character = useCharacterStore()

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

.avatar-section, .basic-info {
  cursor: pointer;
  transition: transform 0.2s;
}

.avatar-section:hover, .basic-info:hover {
  transform: scale(1.05);
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
  align-items: center;  gap: 0.5rem;
  width: 100%;
}

.label {
  font-size: 0.9rem;
  color: #666;
  width: 3em;
  text-align: right;
}
</style>
