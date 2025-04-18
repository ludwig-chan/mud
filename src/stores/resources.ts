import { defineStore } from 'pinia'
import { gameLog } from '../utils/eventBus'
import { useCharacterStore } from './character'

export type FruitType = 'apple' | 'banana' | 'watermelon' | 'durian'

// 定义每种水果的饱食度
const fruitSatiety: Record<FruitType, number> = {
  apple: 5,      // 苹果提供5点饱食度
  banana: 8,     // 香蕉提供8点饱食度
  watermelon: 15, // 西瓜提供15点饱食度
  durian: 20     // 榴莲提供20点饱食度
}

interface FruitCount {
  apple: number;
  banana: number;
  watermelon: number;
  durian: number;
}

interface SeedCount {
  apple: number;
  banana: number;
  watermelon: number;
  durian: number;
}

interface State {
  wood: number;
  ore: number;
  branch: number;
  axeDurability: number;
  fruits: FruitCount;
  seeds: SeedCount;
}

export const useResourcesStore = defineStore('resources', {
  state: () => ({
    wood: 0,
    ore: 0,
    branch: 0,
    axeDurability: 0,
    fruits: {
      apple: 0,
      banana: 0,
      watermelon: 0,
      durian: 0
    } as FruitCount,
    seeds: {
      apple: 0,
      banana: 0,
      watermelon: 0,
      durian: 0
    } as SeedCount
  } as State),
  getters: {
    axeCount(): number {
      return this.axeDurability > 0 ? Math.ceil(this.axeDurability / 100) : 0
    }
  },
  actions: {
    async chopWood() {
      if (this.axeDurability <= 0) {
        gameLog({ text: '需要斧头才能砍伐！', type: 'SYSTEM' })
        return false
      }

      // 扣除耐久度
      this.axeDurability -= 5
      this.wood++
      gameLog({ text: '成功砍伐了一棵树，获得了一个木材', type: 'ACTION' })
      
      // 检查耐久度是否耗尽
      if (this.axeDurability <= 0) {
        gameLog({ text: '你的最后一把斧头已经损坏了！', type: 'SYSTEM' })
      } else {
        gameLog({ text: `斧头剩余耐久度：${this.axeDurability}`, type: 'SYSTEM' })
      }
      
      return true
    },
    async gather() {
      // 随机决定采集到的物品类型
      const rand = Math.random()
      
      if (rand < 0.4) { // 40% 概率获得果实
        const fruitTypes = ['apple', 'banana', 'watermelon', 'durian'] as const
        const randomFruit = fruitTypes[Math.floor(Math.random() * fruitTypes.length)]
        this.fruits[randomFruit]++
        return { type: 'fruit', fruit: randomFruit }
      } else if (rand < 0.7) { // 30% 概率获得树枝
        this.branch++
        return { type: 'branch' }
      } else { // 30% 概率获得矿石
        this.ore++
        return { type: 'ore' }
      }
    },
    async eatFruit(fruitType: FruitType) {
      if (this.fruits[fruitType] > 0) {
        this.fruits[fruitType]--
        
        // 增加饱食度
        const character = useCharacterStore()
        character.satiety = Math.min(100, character.satiety + fruitSatiety[fruitType])
        
        // 20%概率获得种子
        const gotSeed = Math.random() < 0.2
        if (gotSeed) {
          this.seeds[fruitType]++
        }
        
        return { success: true, gotSeed, satietyGained: fruitSatiety[fruitType] }
      }
      return { success: false, gotSeed: false }
    },
    async mineOre() {
      this.ore++
      gameLog({ text: '成功开采了一块矿石', type: 'ITEM' })
    },
    async craftAxe() {
      if (this.wood >= 3 && this.ore >= 2) {
        this.wood -= 3
        this.ore -= 2
        this.axeDurability += 100 // 直接增加耐久度
        gameLog({ text: '成功打造了一把斧头！', type: 'ITEM' })
        return true
      }
      return false
    }
  },
  persist: true
})
