import { defineStore } from 'pinia'
import { gameLog } from '../utils/eventBus'

export interface Equipment {
  count: number;
  durability: number;
}

export interface State {
  axe: Equipment;
}

export const useEquipmentStore = defineStore('equipment', {
  state: () => ({
    axe: { count: 0, durability: 0 }
  }),

  getters: {
    axeCount(): number {
      return this.axe.durability > 0 ? Math.ceil(this.axe.durability / 100) : 0
    }
  },

  actions: {
    async craftAxe(resources: { branch: number; ore: number }): Promise<boolean> {
      if (resources.branch >= 3 && resources.ore >= 2) {
        this.axe.durability += 100 // 直接增加耐久度
        this.axe.count = Math.ceil(this.axe.durability / 100) // 更新斧头数量
        gameLog({ text: '成功打造了一把斧头！', type: 'ITEM' })
        return true
      }
      return false
    },

    useAxe(amount: number = 5): boolean {
      if (this.axe.durability <= 0) {
        gameLog({ text: '需要斧头才能砍伐！', type: 'SYSTEM' })
        return false
      }

      // 扣除耐久度
      this.axe.durability -= amount
      
      // 检查耐久度是否耗尽
      if (this.axe.durability <= 0) {
        gameLog({ text: '你的最后一把斧头已经损坏了！', type: 'SYSTEM' })
      } else {
        gameLog({ text: `斧头剩余耐久度：${this.axe.durability}`, type: 'SYSTEM' })
      }
      
      return true
    }
  },
  persist: true
})
