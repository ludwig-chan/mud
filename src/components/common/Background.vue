<template>
  <div class="background-layer" :class="backgroundClass">
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
