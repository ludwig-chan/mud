<template>
  <div class="game-date-time">
    <span class="date-group">
      <span class="date-item year">第{{timeStore.year}}年</span>
      <span class="date-separator">·</span>
      <span class="date-item season">{{seasonNames[timeStore.season]}}</span>
      <span class="date-separator">·</span>
      <span class="date-item">{{timeStore.day}}日</span>
    </span>
    
    <span class="time-group">
      <span class="time-item">{{timeStore.hour}}时</span>
      <span class="time-separator">/</span>
      <span class="time-item">{{periodNames[currentPeriod]}}</span>
    </span>

    <span class="weather-text">
      {{weatherNames[timeStore.weather]}}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useTimeStore, type Season, type Weather } from '../stores/time'
import { type DayPeriod, seasonNames, weatherNames, periodNames } from '../utils/textMapping'
import { gameLog } from '../utils/eventBus'

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
  'SPRING': {
    dawn: { start: 5, end: 7 },    // 春季黎明：5-7点
    day: { start: 7, end: 18 },    // 春季白天：7-18点
    dusk: { start: 18, end: 20 },  // 春季黄昏：18-20点
    night: { start: 20, end: 5 }   // 春季夜晚：20-5点
  },
  'SUMMER': {
    dawn: { start: 4, end: 6 },    // 夏季黎明：4-6点
    day: { start: 6, end: 19 },    // 夏季白天：6-19点
    dusk: { start: 19, end: 21 },  // 夏季黄昏：19-21点
    night: { start: 21, end: 4 }   // 夏季夜晚：21-4点
  },
  'AUTUMN': {
    dawn: { start: 6, end: 8 },    // 秋季黎明：6-8点
    day: { start: 8, end: 17 },    // 秋季白天：8-17点
    dusk: { start: 17, end: 19 },  // 秋季黄昏：17-19点
    night: { start: 19, end: 6 }   // 秋季夜晚：19-6点
  },
  'WINTER': {
    dawn: { start: 7, end: 9 },    // 冬季黎明：7-9点
    day: { start: 9, end: 16 },    // 冬季白天：9-16点
    dusk: { start: 16, end: 18 },  // 冬季黄昏：16-18点
    night: { start: 18, end: 7 }   // 冬季夜晚：18-7点
  }
}

// 计算当前时段
const currentPeriod = computed((): DayPeriod => {
  const currentHour = timeStore.hour
  const periods = seasonalPeriods[timeStore.season as Season]

  // 检查当前小时属于哪个时段
  if (isInPeriod(currentHour, periods.dawn)) return 'DAWN'
  if (isInPeriod(currentHour, periods.day)) return 'DAY'
  if (isInPeriod(currentHour, periods.dusk)) return 'DUSK'
  return 'NIGHT'
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
  'SPRING': {
    'SUNNY': 0.3,
    'RAINY': 0.3,
    'WINDY': 0.2,
    'SNOWY': 0.05,
    'HAIL': 0.05,
    'SANDSTORM': 0.05,
    'HAZE': 0.05
  },
  'SUMMER': {
    'SUNNY': 0.4,
    'RAINY': 0.3,
    'WINDY': 0.1,
    'SNOWY': 0,
    'HAIL': 0.1,
    'SANDSTORM': 0.05,
    'HAZE': 0.05
  },
  'AUTUMN': {
    'SUNNY': 0.4,
    'RAINY': 0.2,
    'WINDY': 0.2,
    'SNOWY': 0.05,
    'HAIL': 0.05,
    'SANDSTORM': 0.05,
    'HAZE': 0.05
  },
  'WINTER': {
    'SUNNY': 0.2,
    'RAINY': 0.1,
    'WINDY': 0.2,
    'SNOWY': 0.3,
    'HAIL': 0.1,
    'SANDSTORM': 0.05,
    'HAZE': 0.05
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

  return 'SUNNY'
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
      const oldWeather = timeStore.weather
      // 只有在天气真的发生变化时才发送消息      if (newWeather !== oldWeather) {
        timeStore.updateWeather(newWeather)
        // 根据新天气生成简洁的提示
        let weatherMessage = ''
        switch (newWeather) {
          case 'SUNNY': weatherMessage = '天晴了'; break
          case 'RAINY': weatherMessage = '下雨了'; break
          case 'WINDY': weatherMessage = '起风了'; break
          case 'SNOWY': weatherMessage = '下雪了'; break
          case 'HAIL': weatherMessage = '下冰雹了'; break
          case 'SANDSTORM': weatherMessage = '沙尘暴来了'; break
          case 'HAZE': weatherMessage = '起雾了'; break
        }
        gameLog({
          text: weatherMessage,
          type: 'SYSTEM'
        })
      }
    }
  }, 10000) // 改为10秒
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
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  width: 100%;
}

.date-group, .time-group {
  display: flex;
  align-items: center;
  gap: 0.2rem;
}

.date-item, .time-item, .weather-text {
  font-size: 1rem;
  color: #486491;
}

.year, .season {
  font-size: 0.85rem;
  opacity: 0.85;
}

.date-separator, .time-separator {
  color: #666;
  font-weight: 300;
  margin: 0 0.1rem;
}
</style>
