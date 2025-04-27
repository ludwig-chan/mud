import { defineStore } from 'pinia'
import { gameLog, emitter } from '../utils/eventBus'
import { showDialog } from '../utils/dialog'
import { useTimeStore } from './time'
import { useScenesStore } from './scenes'

type Gender = 'male' | 'female'

interface InventoryItem {
  id: string;
  name: string;
  icon: string;
  quantity: number;
  description?: string;
}

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
  inventory: InventoryItem[];
}

export const useCharacterStore = defineStore('character', {
  state: (): CharacterState => ({
    name: '无名氏',
    avatar: '👤',
    age: 18,
    gender: 'male',
    health: 50,
    energy: 100,
    satiety: 50,
    mood: 100,
    hygiene: 100,
    mana: 100,
    inventory: []
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
    async hourlyUpdate() {
      // 降低饱食度并影响体力
      if (this.satiety > 0) {
        this.satiety = Math.max(0, this.satiety - 1)
        
        // 当饱食度降至0时发出提示
        if (this.satiety === 0) {
          gameLog({
            text: '你感到饥肠辘辘...',
            type: 'SYSTEM'
          })
        }
        
        // 饱食度低于20时，降低体力
        if (this.satiety < 20) {
          this.energy = Math.max(0, this.energy - 2)
        }
      } else {
        // 饱食度为0时，大幅降低体力
        this.energy = Math.max(0, this.energy - 5)
      }

      // 体力影响健康值
      if (this.energy < 30) {
        // 低体力时降低健康值
        this.health = Math.max(0, this.health - 1)
        
        if (this.health < 20) {
          gameLog({
            text: '你感觉身体非常虚弱，需要休息和补充能量...',
            type: 'SYSTEM'
          })
        }
      } else if (this.energy > 70 && this.health < 100) {
        // 高体力时缓慢恢复健康值
        this.health = Math.min(100, this.health + 1)
      }

      // 检查是否死亡
      if (this.health === 0) {
        await this.handleDeath()
      }
    },

    // 处理角色死亡
    async handleDeath() {
      const result = await showDialog({
        message: '你的角色死亡了...',
        options: [
          { text: '重新开始', value: 'restart' }
        ],
        closeOnOverlay: false,
        allowMultiple: false
      })

      if (result === 'restart') {
        await this.restartGame()
      }
    },

    // 重置游戏
    async restartGame() {
      // 重置时间
      const timeStore = useTimeStore()
      timeStore.$patch({
        timestamp: 0,
        weather: 'SUNNY'
      })      // 重置所有场景
      const scenes = useScenesStore()
      scenes.resetAllScenes()

      // 重置角色状态
      this.$reset()

      // 清空游戏消息
      emitter.emit('clear-messages')

      // 发送游戏重启消息
      gameLog({
        text: '新的一天开始了...',
        type: 'SYSTEM'
      })
    }
  },
  
  persist: true
})
