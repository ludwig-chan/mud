<template>
  <div class="character-detail">
    <h1>人物信息</h1>
    
    <div class="character-profile">
      <!-- 头像部分 -->      <div class="profile-avatar">
        <div class="avatar">
          <span class="emoji">{{ character.avatar }}</span>
        </div>
      </div>

      <!-- 基本信息部分 -->
      <div class="basic-info">
        <div class="info-group">
          <label>姓名：</label>
          <span>{{ character.name }}</span>
        </div>
        <div class="info-group">
          <label>年龄：</label>
          <span>{{ character.age }}岁</span>
        </div>
        <div class="info-group">          <label>性别：</label>
          <span>{{ character.gender === 'male' ? '男' : '女' }}</span>
        </div>
      </div>

      <!-- 状态信息部分 -->
      <div class="status-info">
        <h2>状态详情</h2>
        <div class="status-grid">
          <div class="status-item">
            <label>健康值：</label>
            <ProgressBar :value="character.health" color="rgb(220, 53, 69)" />
            <span>{{ character.health }}%</span>
          </div>
          <div class="status-item">
            <label>体力值：</label>
            <ProgressBar :value="character.energy" color="rgb(0, 123, 255)" />
            <span>{{ character.energy }}%</span>
          </div>
          <div class="status-item">
            <label>饱腹值：</label>
            <ProgressBar :value="character.satiety" color="rgb(255, 153, 0)" />
            <span>{{ character.satiety }}%</span>
          </div>
          <div class="status-item">
            <label>心情值：</label>
            <ProgressBar :value="character.mood" color="rgb(147, 112, 219)" />
            <span>{{ character.mood }}%</span>
          </div>
          <div class="status-item">
            <label>清洁度：</label>
            <ProgressBar :value="character.hygiene" color="rgb(32, 178, 170)" />
            <span>{{ character.hygiene }}%</span>
          </div>
          <div class="status-item">
            <label>魔力值：</label>
            <ProgressBar :value="character.mana" color="rgb(138, 43, 226)" />
            <span>{{ character.mana }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProgressBar from '../components/ProgressBar.vue'
import { useCharacterStore } from '../stores/character'

const character = useCharacterStore()
</script>

<style scoped>
.character-detail {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.character-profile {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.profile-avatar {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.emoji {
  font-size: 60px;
  line-height: 1;
}

.basic-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.info-group {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.info-group label {
  color: #666;
  font-weight: 500;
}

.status-info {
  margin-top: 2rem;
}

h2 {
  color: #444;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.status-item label {
  min-width: 70px;
  color: #666;
}

.status-item :deep(.progress-bar) {
  flex-grow: 1;
}

.status-item span {
  min-width: 45px;
  text-align: right;
  color: #666;
}
</style>
