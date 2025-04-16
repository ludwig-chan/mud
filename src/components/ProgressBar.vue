<template>
  <div 
    class="progress-bar" 
    :class="{ 'vertical': direction === 'vertical' }"
  >
    <div 
      class="progress" 
      :style="{ 
        [direction === 'vertical' ? 'height' : 'width']: `${value}%`,
        backgroundColor: getBarColor()
      }"
    ></div>
    <span class="progress-text">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  value: number
  max?: number
  label?: string
  direction?: 'horizontal' | 'vertical'
}>()

const getBarColor = () => {
  const warningThreshold = 30
  const percentage = (props.value / (props.max || 100)) * 100
  
  // 使用颜色深浅来表示状态
  if (percentage <= warningThreshold) {
    return 'rgba(76, 175, 80, 0.5)' // 浅色
  }
  return 'rgba(76, 175, 80, 1)' // 深色
}
</script>

<style scoped>
.progress-bar {
  flex: 1;
  height: 20px;
  background-color: #ddd;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.progress-bar.vertical {
  width: 20px;
  height: 100px;
}

.progress {
  height: 100%;
  background-color: #4CAF50;
  border-radius: 4px;
  transition: all 0.3s ease;
  position: absolute;
  left: 0;
  top: 0;
}

.vertical .progress {
  width: 100%;
  height: var(--progress-height);
  position: absolute;
  bottom: 0;
  top: auto;
  min-height: 30px;
  min-width: unset;
}

.progress-text {
  color: #333;
  font-size: 0.8rem;
  white-space: nowrap;
  position: absolute;
  width: 100%;
  text-align: center;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  pointer-events: none;
}

.vertical .progress-text {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: translate(-50%, -50%) rotate(180deg);
  height: auto;
}
</style>
