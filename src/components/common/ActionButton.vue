<template>
  <button
    :class="['action-button', { 'counting-down': isCountingDown }]"
    @click="handleClick"
    @mouseover="handleMouseOver"
    @mouseleave="handleMouseLeave"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
    @touchcancel="handleTouchEnd"
  >
    <div
      v-if="isCountingDown"
      class="progress-bar"
      :style="{ width: `${progressPercentage}%` }"
    ></div>
    <div class="tooltip" v-show="showTooltip && tooltip">{{ tooltip }}</div>
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const showTooltip = ref(false);
const longPressTimer = ref<number | null>(null);
const LONG_PRESS_DURATION = 500; // 长按触发时间（毫秒）
let isLongPressing = false; // 用于标记是否正在长按

const handleMouseOver = () => {
  showTooltip.value = true;
};

const handleMouseLeave = () => {
  showTooltip.value = false;
};

const handleTouchStart = (e: TouchEvent) => {
  // 防止长按时触发浏览器默认的上下文菜单
  isLongPressing = false;
  e.preventDefault();

  longPressTimer.value = window.setTimeout(() => {
    isLongPressing = true;
    showTooltip.value = true;
  }, LONG_PRESS_DURATION);
};

const handleTouchEnd = () => {
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value);
    longPressTimer.value = null;
  }
  if (isLongPressing) {
    showTooltip.value = false;
    isLongPressing = false;
  } else {
    handleClick(); // 如果不是长按，则执行点击事件
  }
};

const props = defineProps<{
  duration?: number; // 操作持续时间，单位为秒
  preCondition?: () => boolean; // 执行操作的前置条件
  tooltip?: string; // 鼠标悬浮时显示的提示信息
}>();

const emit = defineEmits<{
  click: []; // 操作完成时触发
}>();

const isCountingDown = ref(false);
const remainingTime = ref(0); // 存储剩余毫秒数
const progressPercentage = computed(() => {
  const durationMs = (props.duration || 0) * 1000;
  return ((durationMs - remainingTime.value) / durationMs) * 100;
});
let timer: number | null = null;

const cancelCountdown = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  isCountingDown.value = false;
  remainingTime.value = 0;
};

const handleClick = async () => {
  if (isCountingDown.value) {
    cancelCountdown(); // 如果正在倒计时，点击则取消
    return;
  }

  isCountingDown.value = true;
  remainingTime.value = (props.duration || 0) * 1000;

  timer = setInterval(() => {
    remainingTime.value -= 100;
    if (remainingTime.value <= 0) {
      cancelCountdown();
      emit("click");
    }
  }, 100);
};
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
  /* overflow: hidden; */
  width: 100%;
  min-height: 44px;
  /* 移动端友好的最小点击区域 */
  touch-action: manipulation;
  /* 优化移动端触摸 */
  user-select: none;
  /* 防止文本选择 */
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

.tooltip {
  position: absolute;
  top: 50%;
  right: 100%;
  transform: translateY(-50%);
  padding: 4px 8px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 4px;
  font-size: 14px;
  white-space: nowrap;
  margin-right: 8px;
  z-index: 10;
  pointer-events: none;
}

.action-button.counting-down {
  background-color: #4a5568;
  opacity: 0.9;
}

.action-button.counting-down:hover {
  background-color: #e53e3e;  /* 鼠标悬浮时变红，提示可以取消 */
}
</style>
