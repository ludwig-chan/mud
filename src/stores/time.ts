import { defineStore } from 'pinia'

export type Season = 'SPRING' | 'SUMMER' | 'AUTUMN' | 'WINTER'
export type Weather = 'SUNNY' | 'RAINY' | 'WINDY' | 'SNOWY' | 'HAIL' | 'SANDSTORM' | 'HAZE'

interface TimeState {
  timestamp: number; // 游戏内的时间戳，以小时为单位
  weather: Weather;
}

export const useTimeStore = defineStore('time', {
  state: (): TimeState => ({
    timestamp: 0,
    weather: 'SUNNY'
  }),
  
  getters: {
    hour: (state) => Math.floor(state.timestamp % 24),
    day: (state) => Math.floor(state.timestamp / 24) % 30 + 1,
    season: (state): Season => {
      const seasons: Season[] = ['SPRING', 'SUMMER', 'AUTUMN', 'WINTER']
      return seasons[Math.floor((state.timestamp / 24 / 30) % 4)]
    },
    year: (state) => Math.floor(state.timestamp / 24 / 30 / 4) + 1,
  },
  
  actions: {
    updateWeather(newWeather: Weather) {
      this.weather = newWeather
    }
  },
  
  persist: true
})
