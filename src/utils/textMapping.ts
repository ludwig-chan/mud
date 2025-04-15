import { type Season, type Weather } from '../stores/time'

// 定义时段枚举类型
export type DayPeriod = 'DAWN' | 'DAY' | 'DUSK' | 'NIGHT'

// 时段名称映射
export const periodNames: Record<DayPeriod, string> = {
  'DAWN': '黎明',
  'DAY': '白天',
  'DUSK': '黄昏',
  'NIGHT': '夜晚'
}

// 季节名称映射
export const seasonNames: Record<Season, string> = {
  'SPRING': '春季',
  'SUMMER': '夏季',
  'AUTUMN': '秋季',
  'WINTER': '冬季'
}

// 天气名称映射
export const weatherNames: Record<Weather, string> = {
  'SUNNY': '晴朗',
  'RAINY': '下雨',
  'WINDY': '刮风',
  'SNOWY': '下雪',
  'HAIL': '冰雹',
  'SANDSTORM': '沙尘暴',
  'HAZE': '雾霾'
}
