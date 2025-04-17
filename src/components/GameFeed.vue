<template>
  <section class="game-feed">
    <div class="search-bar">
      <div class="search-input-wrapper">
        <input 
          type="text" 
          v-model="searchText" 
          placeholder="搜索消息..."
          class="search-input"
        >
        <button 
          class="filter-toggle"
          @click="isFilterPanelVisible = !isFilterPanelVisible"
          :class="{ 'is-active': isFilterPanelVisible }"
        >
          <span class="arrow-icon">▼</span>
        </button>
      </div>
      <div class="filter-panel" v-show="isFilterPanelVisible">
        <button 
          v-for="type in messageTypes" 
          :key="type"
          :class="['filter-btn', { active: selectedTypes.includes(type) }]"
          @click="toggleFilter(type)"
        >
          {{ getMessageTypeName(type) }}
        </button>
      </div>
    </div>
    <div class="game-messages" ref="messagesContainer">
      <template v-for="(message, index) in filteredMessages" :key="index">
        <!-- 日期分割线 -->
        <div v-if="shouldShowDateDivider(message, messages[index - 1])" class="date-divider">
          {{ formatDateDivider(message.gameTimestamp) }}
        </div>
        <!-- 消息内容 -->
        <div class="message" :style="getMessageStyle(message.timestamp)">
          <span class="message-content">
            <span class="timestamp">【{{ formatSimpleTime(message.gameTimestamp) }}】</span>
            {{ message.text }}
          </span>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { emitter } from '@/utils/eventBus'
import { useTimeStore, type Season } from '@/stores/time'
import { seasonNames } from '@/utils/textMapping'

type MessageType = 'SYSTEM' | 'COMBAT' | 'DIALOGUE' | 'ACTION' | 'ITEM';

interface GameMessage {
  text: string;
  gameTimestamp: number;  // 游戏内时间戳
  timestamp: number;      // 现实世界时间戳
  type: MessageType;      // 消息类型
}

// 组件状态
const messages = ref<GameMessage[]>([])
const messagesContainer = ref<HTMLElement | null>(null)
const timeStore = useTimeStore()
const currentTime = ref(Date.now())

// 搜索和筛选状态
const searchText = ref('')
const isFilterPanelVisible = ref(false)

// 更新过滤后的消息列表，增加搜索功能
const filteredMessages = computed(() => {
  return messages.value.filter(message => {
    const matchesType = selectedTypes.value.includes(message.type)
    const matchesSearch = searchText.value === '' || 
      message.text.toLowerCase().includes(searchText.value.toLowerCase())
    return matchesType && matchesSearch
  })
})

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

// 判断是否需要显示日期分割线
const shouldShowDateDivider = (current: GameMessage, previous: GameMessage | undefined) => {
  if (!previous) return true
  const currentDay = Math.floor(current.gameTimestamp / 24)
  const previousDay = Math.floor(previous.gameTimestamp / 24)
  return currentDay !== previousDay
}

// 格式化分割线日期
const formatDateDivider = (gameTimestamp: number) => {
  const year = Math.floor(gameTimestamp / 24 / 30 / 4) + 1
  const totalDays = Math.floor(gameTimestamp / 24)
  const day = (totalDays % 30) + 1
  const seasonIndex = Math.floor((totalDays % 120) / 30)
  const seasonTypes: Season[] = ['SPRING', 'SUMMER', 'AUTUMN', 'WINTER']
  const season = seasonNames[seasonTypes[seasonIndex]]
  return `第${year}年 ${season} ${day}日`
}

// 格式化简单时间（只显示时）
// 格式化简单时间（只显示时）
const formatSimpleTime = (gameTimestamp: number) => {
  const hour = gameTimestamp % 24
  return `${hour}时`
}

// 消息类型和名称映射
const messageTypes: MessageType[] = ['SYSTEM', 'COMBAT', 'DIALOGUE', 'ACTION', 'ITEM'];
const messageTypeNames: Record<MessageType, string> = {
  SYSTEM: '系统',
  COMBAT: '战斗',
  DIALOGUE: '对话',
  ACTION: '行动',
  ITEM: '物品'
};

// 筛选状态
const selectedTypes = ref<MessageType[]>([...messageTypes]);

// 获取消息类型名称
const getMessageTypeName = (type: MessageType) => messageTypeNames[type];

// 切换筛选
const toggleFilter = (type: MessageType) => {
  const index = selectedTypes.value.indexOf(type);
  if (index === -1) {
    selectedTypes.value.push(type);
  } else if (selectedTypes.value.length > 1) { // 保证至少选中一个类型
    selectedTypes.value.splice(index, 1);
  }
};

// 监听消息
onMounted(() => {  emitter.on('game-message', (data: string | { text: string, type: MessageType }) => {
    const messageData = typeof data === 'string' 
      ? { text: data, type: 'SYSTEM' as MessageType } 
      : data;
    messages.value.push({
      text: messageData.text,
      type: messageData.type,
      gameTimestamp: timeStore.timestamp,
      timestamp: Date.now()
    });
    // 限制最多保留100条消息
    if (messages.value.length > 100) {
      messages.value = messages.value.slice(-100)
    }
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
  padding: 0.5rem;
  border: 1px solid #000;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.search-bar {
  margin-bottom: 0.5rem;
}

.search-input-wrapper {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.search-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.9em;
}

.filter-toggle {
  padding: 0.5rem;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-toggle .arrow-icon {
  transition: transform 0.3s ease;
  display: block;
  font-size: 0.8em;
}

.filter-toggle.is-active .arrow-icon {
  transform: rotate(180deg);
}

.filter-panel {
  padding: 0.5rem;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
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
  border-radius: 2px;
  transition: all 0.3s ease;
}

.message-content {
  display: inline;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.timestamp {
  color: #666;
  font-size: 0.9em;
  margin-right: 4px;
}

.date-divider {
  text-align: center;
  margin: 10px 0;
  position: relative;
  color: #666;
  font-size: 0.9em;
}

.date-divider::before,
.date-divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 30%;
  height: 1px;
  background-color: #ddd;
}

.date-divider::before {
  left: 0;
}

.date-divider::after {
  right: 0;
}

.filter-btn {
  padding: 0.25rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  background-color: #f0f0f0;
}

.filter-btn.active {
  background-color: #4a5568;
  color: white;
  border-color: #4a5568;
}
</style>
