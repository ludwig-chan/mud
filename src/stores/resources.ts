import { defineStore } from 'pinia'
import { gameLog } from '../utils/eventBus'
import { useCharacterStore } from './character'
import { useEquipmentStore } from './equipment'

export type ItemType = 'wood' | 'ore' | 'branch' | 'fruit' | 'seed';
export type FruitType = 'apple' | 'banana' | 'watermelon' | 'durian';

export interface BaseItem {
  count: number;
  type: ItemType;
}

export interface ResourceItem extends BaseItem {
  type: 'wood' | 'ore' | 'branch';
}

export interface FruitItem extends BaseItem {
  type: 'fruit';
  fruitType: FruitType;
  satiety: number;
}

export interface SeedItem extends BaseItem {
  type: 'seed';
  fruitType: FruitType;
}

// 定义每种水果的饱食度
const fruitSatiety: Record<FruitType, number> = {
  apple: 5,      // 苹果提供5点饱食度
  banana: 8,     // 香蕉提供8点饱食度
  watermelon: 15, // 西瓜提供15点饱食度
  durian: 20     // 榴莲提供20点饱食度
}

// 物品名称映射
export const itemNames = {
  wood: '木材',
  ore: '矿石',
  branch: '树枝',
  apple: '苹果',
  banana: '香蕉',
  watermelon: '西瓜',
  durian: '榴莲',
  appleSeed: '苹果种子',
  bananaSeed: '香蕉种子',
  watermelonSeed: '西瓜种子',
  durianSeed: '榴莲种子'
} as const

export interface State {
  wood: ResourceItem;
  ore: ResourceItem;
  branch: ResourceItem;
  apple: FruitItem;
  banana: FruitItem;
  watermelon: FruitItem;
  durian: FruitItem;
  appleSeed: SeedItem;
  bananaSeed: SeedItem;
  watermelonSeed: SeedItem;
  durianSeed: SeedItem;
}

export const useResourcesStore = defineStore('resources', {
  state: () => ({
    wood: { type: 'wood', count: 0 } as ResourceItem,
    ore: { type: 'ore', count: 0 } as ResourceItem,
    branch: { type: 'branch', count: 0 } as ResourceItem,
    apple: { type: 'fruit', fruitType: 'apple', count: 0, satiety: fruitSatiety.apple } as FruitItem,
    banana: { type: 'fruit', fruitType: 'banana', count: 0, satiety: fruitSatiety.banana } as FruitItem,
    watermelon: { type: 'fruit', fruitType: 'watermelon', count: 0, satiety: fruitSatiety.watermelon } as FruitItem,
    durian: { type: 'fruit', fruitType: 'durian', count: 0, satiety: fruitSatiety.durian } as FruitItem,
    appleSeed: { type: 'seed', fruitType: 'apple', count: 0 } as SeedItem,
    bananaSeed: { type: 'seed', fruitType: 'banana', count: 0 } as SeedItem,
    watermelonSeed: { type: 'seed', fruitType: 'watermelon', count: 0 } as SeedItem,
    durianSeed: { type: 'seed', fruitType: 'durian', count: 0 } as SeedItem
  } as State),
  
  getters: {
    // 获取带有显示名称的物品列表
    displayableItems(): { id: string; label: string; count: number }[] {
      return Object.entries(this)
        .filter(([key, item]) => 
          key !== '$id' && 
          typeof item === 'object' && 
          'count' in item && 
          item.count > 0
        )
        .map(([key, item]) => ({
          id: key,
          label: itemNames[key as keyof typeof itemNames],
          count: (item as BaseItem).count
        }))
    }
  },
  
  actions: {
    async chopWood() {
      const equipment = useEquipmentStore()
      if (equipment.useAxe()) {
        this.wood.count++
        gameLog({ text: '成功砍伐了一棵树，获得了一个木材', type: 'ACTION' })
        return true
      }
      return false
    },

    async gather() {
      // 随机决定采集到的物品类型
      const rand = Math.random()
      
      if (rand < 0.4) { // 40% 概率获得果实
        const fruitTypes = ['apple', 'banana', 'watermelon', 'durian'] as const
        const randomFruit = fruitTypes[Math.floor(Math.random() * fruitTypes.length)]
        this[randomFruit].count++
        return { type: 'fruit', fruit: randomFruit }
      } else if (rand < 0.7) { // 30% 概率获得树枝
        this.branch.count++
        return { type: 'branch' }
      } else { // 30% 概率获得矿石
        this.ore.count++
        return { type: 'ore' }
      }
    },

    async eatFruit(fruitType: FruitType): Promise<{ success: boolean; gotSeed: boolean; satietyGained?: number }> {
      const fruit = this[fruitType]
      if (fruit.count > 0) {
        fruit.count--
        
        // 增加饱食度
        const character = useCharacterStore()
        character.satiety = Math.min(100, character.satiety + fruit.satiety)
        
        // 20%概率获得种子
        const gotSeed = Math.random() < 0.2
        if (gotSeed) {
          const seedKey = `${fruitType}Seed` as keyof State
          this[seedKey].count++
        }
        
        return { success: true, gotSeed, satietyGained: fruit.satiety }
      }
      return { success: false, gotSeed: false }
    },

    async mineOre() {
      this.ore.count++
      gameLog({ text: '成功开采了一块矿石', type: 'ITEM' })
    },

    async craftAxe() {
      const equipment = useEquipmentStore()
      if (this.branch.count >= 3 && this.ore.count >= 2) {
        this.branch.count -= 3
        this.ore.count -= 2
        return equipment.craftAxe({ branch: 3, ore: 2 })
      }
      return false
    }
  },
  persist: true
})
