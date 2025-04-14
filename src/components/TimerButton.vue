<template>
  <button 
    :disabled="isCountingDown"
    @click="handleClick"
    class="timer-button"
  >
    <slot></slot>
    <div v-if="isCountingDown" class="countdown">
      {{ remainingTime }}秒
    </div>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  duration?: number // 用时，单位为秒
}>()

const emit = defineEmits<{
  click: [] // 倒计时结束时触发
}>()

const isCountingDown = ref(false)
const remainingTime = ref(0)
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
}

.timer-button:hover:not(:disabled) {
  background-color: #2d3748;
}

.timer-button:disabled {
  background-color: #718096;
  cursor: not-allowed;
}

.countdown {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8em;
  opacity: 0.8;
}
</style>
