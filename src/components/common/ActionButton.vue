<template>
  <button 
    :disabled="isCountingDown"
    @click="handleClick"    class="action-button"
  >
    <div 
      v-if="isCountingDown" 
      class="progress-bar"
      :style="{ width: `${progressPercentage}%` }"
    ></div>
    <div 
      class="tooltip"
    >{{ tooltip }}</div>
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  duration?: number // 操作持续时间，单位为秒
  preCondition?: () => boolean // 执行操作的前置条件
  tooltip?: string // 鼠标悬浮时显示的提示信息
}>()

const emit = defineEmits<{
  click: [] // 操作完成时触发
}>()

const isCountingDown = ref(false)
const remainingTime = ref(0)  // 存储剩余毫秒数
const progressPercentage = computed(() => {
  const durationMs = (props.duration || 0) * 1000
  return ((durationMs - remainingTime.value) / durationMs) * 100
})
let timer: number | null = null

const handleClick = async () => {
  if (isCountingDown.value) return
  
  isCountingDown.value = true
  remainingTime.value = (props.duration || 0) * 1000  // 转换为毫秒
  
  timer = setInterval(() => {
    remainingTime.value -= 100  // 每100毫秒减少100
    if (remainingTime.value <= 0) {
      clearInterval(timer!)
      isCountingDown.value = false
      emit('click')
    }
  }, 100)  // 更新间隔改为100毫秒
}
</script>

<style scoped>
.action-button {
  position: relative;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #4a5568;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
  width: 100%;
  min-height: 44px; /* 移动端友好的最小点击区域 */
  touch-action: manipulation; /* 优化移动端触摸 */
  user-select: none; /* 防止文本选择 */
}

.action-button:hover:not(:disabled) {
  background-color: #2d3748;
  transform: translateY(-1px);
}

.action-button:active:not(:disabled) {
  transform: translateY(0);
}

.action-button:disabled {
  background-color: #718096;
  cursor: not-allowed;
  opacity: 0.7;
}

.progress-bar {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.2);
  transition: width 0.1s linear;
}

.progress-bar + * {
  position: relative;
  z-index: 1;
}

/* Tooltip 样式 */
.action-button {
  /* 省略其他样式 */
}

.tooltip {
  display: none;
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 8px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 4px;
  font-size: 14px;
  white-space: nowrap;
  margin-bottom: 4px;
  z-index: 10;
  pointer-events: none;
}

.action-button:hover .tooltip:not(:empty) {
  display: block;
}
</style>
