<template>
  <div class="background-layer" :class="backgroundClass">
    <div class="celestial-body" :class="{ 'fade-in': shouldShow }">
      {{ currentEmoji }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTimeStore, type Season } from '../../stores/time'

const timeStore = useTimeStore()

// 计算当前时段
const getPeriod = () => {
  const currentHour = timeStore.hour
  const season = timeStore.season as Season
  
  const seasonalPeriods = {
    'SPRING': {
      dawn: { start: 5, end: 7 },
      day: { start: 7, end: 18 },
      dusk: { start: 18, end: 20 },
      night: { start: 20, end: 5 }
    },
    'SUMMER': {
      dawn: { start: 4, end: 6 },
      day: { start: 6, end: 19 },
      dusk: { start: 19, end: 21 },
      night: { start: 21, end: 4 }
    },
    'AUTUMN': {
      dawn: { start: 6, end: 8 },
      day: { start: 8, end: 17 },
      dusk: { start: 17, end: 19 },
      night: { start: 19, end: 6 }
    },
    'WINTER': {
      dawn: { start: 7, end: 9 },
      day: { start: 9, end: 16 },
      dusk: { start: 16, end: 18 },
      night: { start: 18, end: 7 }
    }
  }

  const periods = seasonalPeriods[season]
  
  // 检查当前小时属于哪个时段
  const isInPeriod = (hour: number, period: { start: number; end: number }) => {
    if (period.start < period.end) {
      return hour >= period.start && hour < period.end
    } else {
      return hour >= period.start || hour < period.end
    }
  }

  if (isInPeriod(currentHour, periods.dawn)) return 'dawn'
  if (isInPeriod(currentHour, periods.day)) return 'day'
  if (isInPeriod(currentHour, periods.dusk)) return 'dusk'
  return 'night'
}

// 根据时间段和天气计算背景样式
const backgroundClass = computed(() => {
  const period = getPeriod()
  const weather = timeStore.weather
  
  return {
    'period-dawn': period === 'dawn',
    'period-day': period === 'day',
    'period-dusk': period === 'dusk',
    'period-night': period === 'night',
    [`weather-${weather.toLowerCase()}`]: true
  }
})

// 根据时间段选择显示的 emoji
const currentEmoji = computed(() => {
  const period = getPeriod()
  switch (period) {
    case 'dawn':
      return '🌅'
    case 'day':
      return '☀️'
    case 'dusk':
      return '🌇'
    case 'night':
      return '🌙'
    default:
      return ''
  }
})

// 控制 emoji 的显示
const shouldShow = computed(() => {
  return true // 我们总是显示，只是通过 CSS 动画来控制透明度
})
</script>

<style scoped>
.background-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  transition: background-color 1s ease;
}

/* 时间段样式 */
.period-night {
  background-color: #1a1a1a;
}

.period-dawn {
  background-color: #b4c6d6;
}

.period-day {
  background-color: #f0f8ff;
}

.period-dusk {
  background-color: #dda77b;
}

/* 天气效果 */
.weather-rainy {
  filter: brightness(0.8);
}

.weather-snowy {
  filter: brightness(1.1);
}

.weather-haze {
  filter: brightness(0.7) saturate(0.8);
}

.weather-sandstorm {
  filter: sepia(0.3) brightness(0.9);
}

.weather-windy {
  filter: saturate(1.1);
}

.weather-hail {
  filter: contrast(1.1) brightness(0.9);
}

/* Emoji 样式 */
.celestial-body {
  position: fixed;
  font-size: 5rem;
  opacity: 0;
  transition: all 2s ease;
  z-index: -1;
}

.celestial-body.fade-in {
  opacity: 0.2;
}

/* 根据时间段调整 emoji 位置 */
.period-dawn .celestial-body {
  top: 10%;
  left: 10%;
}

.period-day .celestial-body {
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
}

.period-dusk .celestial-body {
  top: 10%;
  right: 10%;
}

.period-night .celestial-body {
  top: 15%;
  right: 15%;
}

/* 天气效果也会影响 emoji */
.weather-rainy .celestial-body,
.weather-snowy .celestial-body,
.weather-haze .celestial-body {
  opacity: 0.25; /* 在这些天气下稍微降低亮度，但保持可见 */
}

.weather-sandstorm .celestial-body {
  opacity: 0.2; /* 沙尘暴天气下降低更多亮度，但仍然清晰可见 */
}
</style>
