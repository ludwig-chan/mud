<template>  <section class="game-feed">
    <h2>日志</h2>
    <div class="game-messages" ref="messagesContainer">
      <div v-for="(message, index) in messages" :key="index" class="message">
        {{ message }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { emitter } from '@/utils/eventBus'

// 组件状态
const messages = ref<string[]>([])
const messagesContainer = ref<HTMLElement | null>(null)

// 滚动到底部的方法
const scrollToBottom = () => {
  if (messagesContainer.value) {
    setTimeout(() => {
      messagesContainer.value!.scrollTop = messagesContainer.value!.scrollHeight
    }, 0)
  }
}

// 监听消息
onMounted(() => {
  emitter.on('game-message', (message) => {
    messages.value.push(message)
    scrollToBottom()
  })
})

// 组件卸载时清理监听器
onUnmounted(() => {
  emitter.off('game-message')
})
</script>

<style scoped>
.game-feed {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #000;
  height: 200px;  /* 固定总高度 */
  display: flex;
  flex-direction: column;
}

.game-messages {
  width: 100%;
  flex: 1;  /* 自动填充剩余空间 */
  overflow-y: auto;
  min-height: 0;  /* 确保flex-grow正常工作 */
}

h2 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: #2d3748;
  flex-shrink: 0;  /* 防止标题被压缩 */
}

.message {
  background-color: white;
  border-radius: 4px;
}
</style>
