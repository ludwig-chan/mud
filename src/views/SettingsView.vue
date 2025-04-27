<template>
  <div class="settings-view">
    <div class="back-button" @click="goBack">⬅️</div>
    <h1>游戏设置</h1>
    
    <div class="settings-content">
      <!-- 这里后续可以添加具体的设置项 -->
      <div class="settings-section">
        <h2>基本设置</h2>
        <!-- 后续可以添加音效、音量等设置 -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.settings-view {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  position: relative;
}

.back-button {
  position: absolute;
  top: 1rem;
  left: 1rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.1);
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1.2rem;
}

.back-button:hover {
  background-color: rgba(0, 0, 0, 0.2);
  color: #333;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.settings-content {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.settings-section {
  margin-bottom: 2rem;
}

h2 {
  color: #444;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}
</style>
