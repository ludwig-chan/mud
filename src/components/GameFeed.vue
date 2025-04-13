<template>
  <section class="game-feed">
    <div class="game-messages">
      <h2>游戏信息</h2>
      <!-- 游戏消息将在这里显示 -->
    </div>
    <div class="game-dialog">
      <h2>对话内容</h2>
      <!-- 对话内容将在这里显示 -->
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 组件状态
const messages = ref<string[]>([])
const dialogs = ref<string[]>([])
</script>

<style scoped>
.game-feed {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  gap: 1rem;
}

.game-messages, .game-dialog {
  flex: 1;
}

h2 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: #2d3748;
}
</style>
