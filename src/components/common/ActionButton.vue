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
const touchDelayTimer = ref<number | null>(null); // 触摸延迟计时器
const doubleClickTimer = ref<number | null>(null); // 双击检测计时器
let isLongPressing = false; // 用于标记是否正在长按
let isWaitingSecondTouchEnd = false; // 用于标记是否在等待第二次触摸结束

const handleMouseOver = () => {
  showTooltip.value = true;
};

const handleMouseLeave = () => {
  showTooltip.value = false;
};

const handleTouchStart = (e: TouchEvent) => {
  // 防止长按时触发浏览器默认的上下文菜单
  isLongPressing = false;
  e.preventDefault(); // 避免触发click事件

  // 如果存在延迟计时器，说明在等待第二次点击，这时触发了touchstart
  if (touchDelayTimer.value) {
    clearTimeout(touchDelayTimer.value);
    touchDelayTimer.value = null;
    isWaitingSecondTouchEnd = true; // 标记等待第二次touchend

    // 设置双击检测计时器
    doubleClickTimer.value = window.setTimeout(() => {
      // 如果到时间了还没收到第二次touchend，就重置状态
      isWaitingSecondTouchEnd = false;
      doubleClickTimer.value = null;
    }, 200);

    return; // 不执行后续的长按逻辑
  }

  longPressTimer.value = window.setTimeout(() => {
    isLongPressing = true;
    showTooltip.value = true;
  }, 500); // 500ms认为是长按
};

const handleTouchEnd = () => {
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value);
    longPressTimer.value = null;
  }

  // 如果正在等待第二次touchend，并且doubleClickTimer还在，说明这是一个有效的双击
  if (isWaitingSecondTouchEnd && doubleClickTimer.value) {
    clearTimeout(doubleClickTimer.value);
    doubleClickTimer.value = null;
    isWaitingSecondTouchEnd = false;
    cancelCountdown(); // 执行取消倒计时
    return;
  }

  if (isLongPressing) {
    showTooltip.value = false;
    isLongPressing = false;
    return;
  }

  // 清除之前的延迟计时器
  if (touchDelayTimer.value) {
    clearTimeout(touchDelayTimer.value);
  }

  // 不在等待第二次touchend的情况下，才设置新的延迟计时器
  if (!isWaitingSecondTouchEnd) {
    touchDelayTimer.value = window.setTimeout(() => {
      if (isCountingDown.value) {
        return;
      }
      startCountdown();
      touchDelayTimer.value = null;
    }, 200); // 等待200ms，如果这期间没有新的touchstart，就执行startCountdown
  }
};

const props = defineProps<{
  duration?: number; // 操作持续时间，单位为秒
  disabled?: boolean; // 按钮是否禁用
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

const startCountdown = () => {
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

const handleClick = () => {
  if (isCountingDown.value) {
    cancelCountdown(); // 如果正在倒计时，点击则取消
    return;
  }

  startCountdown(); // 否则开始倒计时
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
  opacity: 0.6;
}

.action-button.counting-down:hover {
  background-color: #e53e3e; /* 鼠标悬浮时变红，提示可以取消 */
}
</style>
