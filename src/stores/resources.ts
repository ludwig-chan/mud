import { defineStore } from 'pinia'

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

export const useResourcesStore = defineStore('resources', {
  state: () => ({
    wood: 0,
    ore: 0,
    axe: 0,
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
  }),
  actions: {
    async chopWood() {
      this.wood++
    },    async gatherFruit() {
      // 随机选择一种水果
      const fruitTypes = ['apple', 'banana', 'watermelon', 'durian'] as const;
      const randomFruit = fruitTypes[Math.floor(Math.random() * fruitTypes.length)];
      
      // 增加对应类型的水果数量
      this.fruits[randomFruit]++;
      
      return { fruit: randomFruit };
    },

    async eatFruit(fruitType: 'apple' | 'banana' | 'watermelon' | 'durian') {
      if (this.fruits[fruitType] > 0) {
        this.fruits[fruitType]--;
        
        // 20%概率获得种子
        const gotSeed = Math.random() < 0.2;
        if (gotSeed) {
          this.seeds[fruitType]++;
        }
        
        return { success: true, gotSeed };
      }
      return { success: false, gotSeed: false };
    },async mineOre() {
      this.ore++
    },
    async craftAxe() {
      if (this.wood >= 3 && this.ore >= 2) {
        this.wood -= 3
        this.ore -= 2
        this.axe++
        return true
      }
      return false
    }
  },
  persist: true
})
