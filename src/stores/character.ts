import { defineStore } from 'pinia'
import { gameLog } from '../utils/eventBus'

type Gender = 'male' | 'female'

interface CharacterState {
  name: string;
  avatar: string;
  age: number;
  gender: Gender;
  health: number;
  energy: number;
  satiety: number;
  mood: number;
  hygiene: number;
  mana: number;
}

export const useCharacterStore = defineStore('character', {
  state: (): CharacterState => ({
    name: '无名氏',
    avatar: '👤',
    age: 18,
    gender: 'male',
    health: 100,  // 初始值设为100
    energy: 100,
    satiety: 100, // 初始值设为100
    mood: 100,
    hygiene: 100,
    mana: 0
  }),

  actions: {
    updateName(newName: string) {
      this.name = newName
    },
    updateAvatar(newAvatar: string) {
      this.avatar = newAvatar
    },
    updateStats(stats: Partial<CharacterState>) {
      Object.assign(this, stats)
    },
    
    // 处理每小时状态变化
    hourlyUpdate() {
      // 降低饱食度
      if (this.satiety > 0) {
        this.satiety = Math.max(0, this.satiety - 1)
        
        // 当饱食度降至0时发出提示
        if (this.satiety === 0) {
          gameLog({
            text: '你感到饥肠辘辘...',
            type: 'SYSTEM'
          })
        }
      } 
      // 饱食度为0时降低健康值
      else if (this.health > 0) {
        this.health = Math.max(0, this.health - 1)
        
        if (this.health < 20) {
          gameLog({
            text: '你感觉身体非常虚弱，需要尽快进食...',
            type: 'SYSTEM'
          })
        }
      }
    }
  },
  
  persist: true
})
