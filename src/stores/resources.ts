import { defineStore } from 'pinia';
import { gameLog } from '../utils/eventBus';
import { useCharacterStore } from './character';
import { useEquipmentStore } from './equipment';
import { resourceNames } from '../utils/textMapping';

// 工具函数：处理物品使用的通用逻辑
function useItem(
  item: BaseItem,
  effect: (character: ReturnType<typeof useCharacterStore>, resources: ReturnType<typeof useResourcesStore>) => void
) {
  if (item.count > 0) {
    item.count--;
    const character = useCharacterStore();
    const resources = useResourcesStore();
    effect(character, resources);
  }
}

export type ItemType = 'wood' | 'ore' | 'branch' | 'fruit' | 'seed';
export type SubType = 'apple' | 'banana' | 'watermelon' | 'durian';

export interface BaseItem {
  count: number;
  type: ItemType;
  name: string;
  use?: () => void;  // 可选的使用方法
}

export interface ResourceItem extends BaseItem {
  type: 'wood' | 'ore' | 'branch';
}

export interface FruitItem extends BaseItem {
  type: 'fruit';
  subType: SubType;
}

export interface SeedItem extends BaseItem {
  type: 'seed';
  subType: SubType;
}

export interface State {
  wood: ResourceItem;
  ore: ResourceItem;
  branch: ResourceItem;
  apple: FruitItem;
  banana: FruitItem;
  watermelon: FruitItem;
  durian: FruitItem;
  appleSeed: SeedItem;
  watermelonSeed: SeedItem;
  durianSeed: SeedItem;
}

export const useResourcesStore = defineStore('resources', {
  state: () => ({
    wood: { type: 'wood', count: 0, name: resourceNames.wood } as ResourceItem,
    ore: { type: 'ore', count: 0, name: resourceNames.ore } as ResourceItem,
    branch: { type: 'branch', count: 0, name: resourceNames.branch } as ResourceItem,
    apple: {
      type: 'fruit',
      subType: 'apple',
      count: 0,
      name: resourceNames.apple,
      use() {
        useItem(this, (character, resources) => {
          character.satiety = Math.min(100, character.satiety + 5);

          // 20%概率获得种子
          if (Math.random() < 0.2) {
            resources.appleSeed.count++;
          }
        });
      }
    } as FruitItem,
    banana: {
      type: 'fruit',
      subType: 'banana',
      count: 0,
      name: resourceNames.banana,
      use() {
        useItem(this, (character, resources) => {
          character.satiety = Math.min(100, character.satiety + 8);
        });
      }
    } as FruitItem,
    watermelon: {
      type: 'fruit',
      subType: 'watermelon',
      count: 0,
      name: resourceNames.watermelon,
      use() {
        useItem(this, (character, resources) => {
          character.satiety = Math.min(100, character.satiety + 15);

          // 20%概率获得种子
          if (Math.random() < 0.2) {
            resources.watermelonSeed.count++;
          }
        });
      }
    } as FruitItem,
    durian: {
      type: 'fruit',
      subType: 'durian',
      count: 0,
      name: resourceNames.durian,
      use() {
        useItem(this, (character, resources) => {
          character.satiety = Math.min(100, character.satiety + 20);

          // 20%概率获得种子
          if (Math.random() < 0.2) {
            resources.durianSeed.count++;
          }
        });
      }
    } as FruitItem,
    appleSeed: { type: 'seed', subType: 'apple', count: 0, name: resourceNames.appleSeed } as SeedItem,
    watermelonSeed: { type: 'seed', subType: 'watermelon', count: 0, name: resourceNames.watermelonSeed } as SeedItem,
    durianSeed: { type: 'seed', subType: 'durian', count: 0, name: resourceNames.durianSeed } as SeedItem
  } as State),

  getters: {
    displayableItems() {
      return Object.entries(this);
    }
  },

  actions: {
    async chopWood() {
      const equipment = useEquipmentStore();
      if (equipment.useAxe()) {
        this.wood.count++;
        gameLog({ text: '成功砍伐了一棵树，获得了一个木材', type: 'ACTION' });
        return true;
      }
      return false;
    },

    async gather() {
      // 随机决定采集到的物品类型
      const rand = Math.random();

      if (rand < 0.4) { // 40% 概率获得果实
        const subTypes: SubType[] = ['apple', 'banana', 'watermelon', 'durian'];
        const randomSubType = subTypes[Math.floor(Math.random() * subTypes.length)];
        this[randomSubType].count++;
        return { type: 'fruit', subType: randomSubType };
      } else if (rand < 0.7) { // 30% 概率获得树枝
        this.branch.count++;
        return { type: 'branch' };
      } else { // 30% 概率获得矿石
        this.ore.count++;
        return { type: 'ore' };
      }
    },
    async mineOre() {
      this.ore.count++;
      gameLog({ text: '成功开采了一块矿石', type: 'ITEM' });
    },

    async craftAxe() {
      const equipment = useEquipmentStore();
      if (this.branch.count >= 3 && this.ore.count >= 2) {
        this.branch.count -= 3;
        this.ore.count -= 2;
        return equipment.craftAxe({ branch: 3, ore: 2 });
      }
      return false;
    }
  },
  persist: true
});
