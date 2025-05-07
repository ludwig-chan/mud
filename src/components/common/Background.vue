<template>
  <div class="background-layer" :class="backgroundClass">
    <div class="celestial-body" :class="{ 'fade-in': shouldShow }">
      {{ currentEmoji }} {{ weatherEmoji }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTimeStore } from '../../stores/time'

const timeStore = useTimeStore()

// 根据时间段和天气计算背景样式
const backgroundClass = computed(() => {
  const period = timeStore.currentPeriod.toLowerCase()
  const weather = timeStore.weather
  
  return {
    'period-dawn': period === 'dawn',
    'period-day': period === 'day',
    'period-dusk': period === 'dusk',
    'period-night': period === 'night',
    [`weather-${weather.toLowerCase()}`]: true
  }
})

// 根据时段选择显示的主要天体 emoji
const currentEmoji = computed(() => {
  const period = timeStore.currentPeriod
  switch (period) {
    case 'DAY': return '☀️'
    case 'NIGHT': return '🌙'
    default: return ''
  }
})

// 根据天气显示额外的 emoji
const weatherEmoji = computed(() => {
  switch (timeStore.weather) {
    case 'RAINY': return '🌧️'
    case 'WINDY': return '💨'
    case 'SNOWY': return '❄️'
    case 'HAIL': return '🌨️'
    case 'SANDSTORM': return '🌪️'
    case 'HAZE': return '🌫️'
    case 'SUNNY': 
      // 如果是晴天，只显示太阳/月亮即可，不需要额外emoji
      return ''
    default: return ''
  }
})

// 只在白天和夜晚显示天体
const shouldShow = computed(() => 
  timeStore.currentPeriod === 'DAY' || timeStore.currentPeriod === 'NIGHT'
)
</script>

<style scoped>
.background-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  transition: all 1s ease-in-out;
}

.celestial-body {
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translateX(-50%) translateY(-20px);
  font-size: 4rem;
  opacity: 0;
  transition: all 1s ease-in-out;
  text-align: center;
  white-space: nowrap;
}

.celestial-body.fade-in {
  opacity: 0.8;
  transform: translateX(-50%) translateY(0);
}

/* 时段样式 */
.period-dawn {
  background: linear-gradient(to bottom, #ff7e5f, #feb47b);
}

.period-day {
  background: linear-gradient(to bottom, #4CA1AF, #C4E0E5);
}

.period-dusk {
  background: linear-gradient(to bottom, #FF512F, #F09819);
}

.period-night {
  background: linear-gradient(to bottom, #1a2a6c, #2a3c7c);
}

/* 天气效果 */
.weather-rainy {
  filter: brightness(0.8) saturate(0.8);
}

.weather-windy {
  filter: contrast(1.1) brightness(1.1);
}

.weather-snowy {
  filter: brightness(1.2) contrast(0.9);
}

.weather-hail {
  filter: brightness(0.7) contrast(1.2);
}

.weather-sandstorm {
  filter: sepia(0.5) brightness(0.9);
}

.weather-haze {
  filter: blur(1px) brightness(0.9);
}
</style>
