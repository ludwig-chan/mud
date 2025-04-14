<template>  <section class="game-feed">
    <h2>日志</h2>    <div class="game-messages" ref="messagesContainer">
      <div v-for="(message, index) in messages" :key="index" class="message" :style="getMessageStyle(message.timestamp)">
        <span class="timestamp">{{ formatTime(message.timestamp) }}</span>
        <span class="text">{{ message.text }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { emitter } from '@/utils/eventBus'

interface GameMessage {
  text: string;
  timestamp: number;
}

// 组件状态
const messages = ref<GameMessage[]>([])
const messagesContainer = ref<HTMLElement | null>(null)
const currentTime = ref(Date.now())

// 滚动到底部的方法
const scrollToBottom = () => {
  if (messagesContainer.value) {
    setTimeout(() => {
      messagesContainer.value!.scrollTop = messagesContainer.value!.scrollHeight
    }, 0)
  }
}

// 更新当前时间
const updateTimer = setInterval(() => {
  currentTime.value = Date.now()
}, 1000)

// 计算消息样式
const getMessageStyle = (timestamp: number) => {
  const timeDiff = (currentTime.value - timestamp) / 1000 // 转换为秒
  return {
    opacity: timeDiff > 10 ? 0.5 : 1,
    color: timeDiff > 10 ? '#666' : '#000'
  }
}

// 格式化时间
const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
}

// 监听消息
onMounted(() => {
  emitter.on('game-message', (message: string) => {
    messages.value.push({
      text: message,
      timestamp: Date.now()
    })
    scrollToBottom()
  })
})

// 组件卸载时清理监听器和定时器
onUnmounted(() => {
  emitter.off('game-message')
  clearInterval(updateTimer)
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
  padding: 4px 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.timestamp {
  color: #666;
  font-size: 0.9em;
  min-width: 80px;
}

.text {
  flex: 1;
}
</style>
