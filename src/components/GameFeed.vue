<template>
  <section class="game-feed">
    <div class="game-messages" ref="messagesContainer">
      <div v-for="(message, index) in messages" :key="index" class="message" :style="getMessageStyle(message.timestamp)">
        <span class="timestamp">{{ formatGameTime(message.gameTimestamp) }}</span>
        <span class="text">{{ message.text }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { emitter } from '@/utils/eventBus'
import { useTimeStore, type Season } from '@/stores/time'
import { seasonNames } from '@/utils/textMapping'

interface GameMessage {
  text: string;
  gameTimestamp: number;  // 游戏内时间戳
  timestamp: number;      // 现实世界时间戳
}

// 组件状态
const messages = ref<GameMessage[]>([])
const messagesContainer = ref<HTMLElement | null>(null)
const timeStore = useTimeStore()
const currentTime = ref(Date.now())

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

// 滚动到底部的方法
const scrollToBottom = () => {
  if (messagesContainer.value) {
    setTimeout(() => {
      messagesContainer.value!.scrollTop = messagesContainer.value!.scrollHeight
    }, 0)
  }
}

// 格式化游戏时间
const formatGameTime = (gameTimestamp: number) => {
  const year = Math.floor(gameTimestamp / 24 / 30 / 4) + 1
  const totalDays = Math.floor(gameTimestamp / 24)
  const day = totalDays % 30 + 1
  const hour = gameTimestamp % 24
  const seasonIndex = Math.floor((totalDays % 120) / 30)
  const seasonTypes: Season[] = ['SPRING', 'SUMMER', 'AUTUMN', 'WINTER']
  const season = seasonNames[seasonTypes[seasonIndex]]
  
  return `第${year}年${season}${day}日${hour}时`
}

// 监听消息
onMounted(() => {
  emitter.on('game-message', (message: string) => {
    messages.value.push({
      text: message,
      gameTimestamp: timeStore.timestamp,
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
  min-width: 120px;  /* 增加宽度以适应新的时间格式 */
}

.text {
  flex: 1;
}
</style>
