import { defineStore } from 'pinia'

export type Season = '春季' | '夏季' | '秋季' | '冬季'
export type Weather = '晴朗' | '下雨' | '刮风' | '下雪' | '冰雹' | '沙尘暴' | '雾霾'

interface TimeState {
  timestamp: number; // 游戏内的时间戳
  weather: Weather;
}

export const useTimeStore = defineStore('time', {
  state: (): TimeState => ({
    timestamp: 0,
    weather: '晴朗'
  }),
  
  getters: {
    hour: (state) => Math.floor(state.timestamp % 24),
    day: (state) => Math.floor(state.timestamp / 24),
    season: (state) => {
      const seasons = ['春季', '夏季', '秋季', '冬季']
      return seasons[Math.floor((state.timestamp / 24 / 90) % 4)]
    },
    year: (state) => Math.floor(state.timestamp / 24 / 360) + 1,
  },
  
  actions: {
    // 更新天气    
    updateWeather(newWeather: Weather) {
      this.weather = newWeather
    }
  },
  
  persist: true
})
