<template>
  <button 
    :disabled="isCountingDown"
    @click="handleClick"
    class="timer-button"
  >
    <div 
      v-if="isCountingDown" 
      class="progress-bar"
      :style="{ width: `${progressPercentage}%` }"
    ></div>
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  duration?: number // 用时，单位为秒
}>()

const emit = defineEmits<{
  click: [] // 倒计时结束时触发
}>()

const isCountingDown = ref(false)
const remainingTime = ref(0)
const progressPercentage = computed(() => {
  return ((props.duration! - remainingTime.value) / props.duration!) * 100
})
let timer: NodeJS.Timeout | null = null

const handleClick = async () => {
  if (isCountingDown.value) return
  
  isCountingDown.value = true
  remainingTime.value = props.duration || 0
  
  timer = setInterval(() => {
    remainingTime.value--
    if (remainingTime.value <= 0) {
      clearInterval(timer!)
      isCountingDown.value = false
      emit('click')
    }
  }, 1000)
}
</script>

<style scoped>
.timer-button {
  position: relative;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #4a5568;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
  overflow: hidden;
}

.timer-button:hover:not(:disabled) {
  background-color: #2d3748;
}

.timer-button:disabled {
  background-color: #718096;
  cursor: not-allowed;
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
</style>
