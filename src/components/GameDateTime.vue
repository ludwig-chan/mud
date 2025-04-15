<template>
  <div class="game-date-time">
    <div class="date">第{{ timeStore.year }}年 {{ timeStore.season }} {{ timeStore.hour }}时/{{ currentPeriod }}</div>
    <div class="weather">天气：{{ timeStore.weather }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useTimeStore, type Season, type Weather } from '../stores/time'

const timeStore = useTimeStore()

type TimePeriod = {
  start: number;
  end: number;
}

type SeasonPeriods = {
  dawn: TimePeriod;
  day: TimePeriod;
  dusk: TimePeriod;
  night: TimePeriod;
}

type SeasonalPeriods = Record<Season, SeasonPeriods>

// 定义各个季节的时段分布
const seasonalPeriods: SeasonalPeriods = {
  '春季': {
    dawn: { start: 5, end: 7 },    // 春季黎明：5-7点
    day: { start: 7, end: 18 },    // 春季白天：7-18点
    dusk: { start: 18, end: 20 },  // 春季黄昏：18-20点
    night: { start: 20, end: 5 }   // 春季夜晚：20-5点
  },
  '夏季': {
    dawn: { start: 4, end: 6 },    // 夏季黎明：4-6点
    day: { start: 6, end: 19 },    // 夏季白天：6-19点
    dusk: { start: 19, end: 21 },  // 夏季黄昏：19-21点
    night: { start: 21, end: 4 }   // 夏季夜晚：21-4点
  },
  '秋季': {
    dawn: { start: 6, end: 8 },    // 秋季黎明：6-8点
    day: { start: 8, end: 17 },    // 秋季白天：8-17点
    dusk: { start: 17, end: 19 },  // 秋季黄昏：17-19点
    night: { start: 19, end: 6 }   // 秋季夜晚：19-6点
  },
  '冬季': {
    dawn: { start: 7, end: 9 },    // 冬季黎明：7-9点
    day: { start: 9, end: 16 },    // 冬季白天：9-16点
    dusk: { start: 16, end: 18 },  // 冬季黄昏：16-18点
    night: { start: 18, end: 7 }   // 冬季夜晚：18-7点
  }
}

// 计算当前时段
const currentPeriod = computed(() => {
  const currentHour = timeStore.hour
  const periods = seasonalPeriods[timeStore.season as Season]

  // 检查当前小时属于哪个时段
  if (isInPeriod(currentHour, periods.dawn)) return '黎明'
  if (isInPeriod(currentHour, periods.day)) return '白天'
  if (isInPeriod(currentHour, periods.dusk)) return '黄昏'
  return '夜晚'
})

// 判断当前小时是否在指定时段内
function isInPeriod(hour: number, period: TimePeriod) {
  if (period.start < period.end) {
    return hour >= period.start && hour < period.end
  } else {
    // 处理跨日的情况（比如夜晚的20点到第二天5点）
    return hour >= period.start || hour < period.end
  }
}

type WeatherProbabilities = Record<Weather, number>
type SeasonalWeatherProbabilities = Record<Season, WeatherProbabilities>

// 每个季节的天气概率配置
const seasonalWeatherProbabilities: SeasonalWeatherProbabilities = {
  '春季': {
    '晴朗': 0.3,
    '下雨': 0.3,
    '刮风': 0.2,
    '下雪': 0.05,
    '冰雹': 0.05,
    '沙尘暴': 0.05,
    '雾霾': 0.05
  },
  '夏季': {
    '晴朗': 0.4,
    '下雨': 0.3,
    '刮风': 0.1,
    '下雪': 0,
    '冰雹': 0.1,
    '沙尘暴': 0.05,
    '雾霾': 0.05
  },
  '秋季': {
    '晴朗': 0.4,
    '下雨': 0.2,
    '刮风': 0.2,
    '下雪': 0.05,
    '冰雹': 0.05,
    '沙尘暴': 0.05,
    '雾霾': 0.05
  },
  '冬季': {
    '晴朗': 0.2,
    '下雨': 0.1,
    '刮风': 0.2,
    '下雪': 0.3,
    '冰雹': 0.1,
    '沙尘暴': 0.05,
    '雾霾': 0.05
  }
}

// 根据季节随机生成天气
function generateWeather(currentSeason: Season): Weather {
  const probabilities = seasonalWeatherProbabilities[currentSeason]
  const random = Math.random()
  let cumulativeProbability = 0

  for (const [weatherType, probability] of Object.entries(probabilities)) {
    cumulativeProbability += probability
    if (random < cumulativeProbability) {
      return weatherType as Weather
    }
  }

  return '晴朗'
}

// 自动时间推进
let timeInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  // 每10秒推进一小时
  timeInterval = setInterval(() => {
    // 更新时间戳
    timeStore.$patch(state => {
      state.timestamp++
    })

    // 20%的概率改变天气
    if (Math.random() < 0.2) {
      const newWeather = generateWeather(timeStore.season as Season)
      timeStore.updateWeather(newWeather)
    }
  }, 10000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style scoped>
.game-date-time {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.date,
.weather,
.time-period {
  font-size: 1rem;
}

.time-period {
  margin: 0 1rem;
}
</style>
