import { defineStore } from 'pinia';
import type { GameScene, GameResource } from './types';
import { gameLog } from '../../utils/eventBus';
import { useEquipmentStore } from '../equipment';
import { useCharacterStore } from '../character';
import { 
  type ResourceInfo, 
  getStockAmount, 
  hasStock, 
  getOrCreateResource, 
  calculateExploreResources 
} from '../../utils/resourceUtils';

const INITIAL_STOCK = {
  wood: {
    current: 50,
    max: 50
  },
  ore: {
    current: 30,
    max: 30
  },
  branch: {
    current: 40,
    max: 40
  },
  apple: {
    current: 20,
    max: 20
  }
} as const;

const FOREST_RESOURCES: readonly ResourceInfo[] = [
  { id: 'branch', type: 'branch', name: '树枝' },
  { id: 'ore', type: 'ore', name: '矿石' },
  { id: 'apple', type: 'apple', name: '苹果' }
];

export const useForestSceneStore = defineStore('forestScene', {
  state: () => ({
    scene: {
      id: 'forest',
      name: '树林',
      resources: [],
      actions: [],
      stock: JSON.parse(JSON.stringify(INITIAL_STOCK))
    } as GameScene
  }),

  getters: {
    resources: (state) => state.scene.resources,
    actions: (state) => state.scene.actions
  },

  actions: {
    reset() {
      // 清空已收集的资源
      this.scene.resources = []
      
      // 重置库存到初始状态
      this.scene.stock = JSON.parse(JSON.stringify(INITIAL_STOCK))
    },

    // 检查体力值是否足够
    checkEnergy(cost: number): boolean {
      const character = useCharacterStore();
      if (character.energy < cost) {
        gameLog({ 
          text: "你太累了,需要休息一下...",
          type: "SYSTEM" 
        });
        return false;
      }
      return true;
    },

    // 消耗体力值
    consumeEnergy(cost: number) {
      const character = useCharacterStore();
      character.energy = Math.max(0, character.energy - cost);
    },

    // 为动作添加体力值消耗的包装器函数
    async withEnergyCost(cost: number, action: () => Promise<void>): Promise<void> {
      if (!this.checkEnergy(cost)) {
        return;
      }
      await action();
      this.consumeEnergy(cost);
    },

    async chopWood() {
      try {
        const amount = await getStockAmount(this.scene.stock, 'wood');
        const woodResource = getOrCreateResource(this.scene.resources, {
          id: 'wood',
          type: 'wood',
          name: '木材'
        });
        woodResource.count++;
        gameLog({ text: "获得了一个木材", type: "ITEM" });

        // 如果库存耗尽，发出提示
        if (!hasStock(this.scene.stock, 'wood')) {
          gameLog({ text: "这片区域的树木已经被砍伐殆尽了", type: "SYSTEM" });
        }
      } catch (error) {
        gameLog({ text: "这里已经没有可以砍伐的树木了", type: "SYSTEM" });
      }
    },

    async explore() {
      // 计算本次探索可能获得的资源
      const selectedResources = calculateExploreResources(this.scene.stock, FOREST_RESOURCES);

      if (selectedResources.length === 0) {
        gameLog({ text: "探索了一圈，但是什么都没有发现", type: "ITEM" });
        return;
      }

      const gainedResources: string[] = [];

      // 处理每种被选中的资源
      for (const resource of selectedResources) {
        try {
          // 尝试获取资源
          const amount = await getStockAmount(this.scene.stock, resource.type, resource.expectedAmount);

          // 获取或创建资源
          const playerResource = getOrCreateResource(this.scene.resources, resource);
          playerResource.count += amount;
          gainedResources.push(`${amount}个${resource.name}`);
        } catch (error) {
          continue;
        }
      }

      if (gainedResources.length === 0) {
        gameLog({ text: "探索了一圈，但是什么都没有发现", type: "ITEM" });
        return;
      }
      const resourcesText = gainedResources.join('、');
      gameLog({ text: `探索发现了${resourcesText}`, type: "ITEM" });
    },

    async mineOre() {
      try {
        const amount = await getStockAmount(this.scene.stock, 'ore');
        const oreResource = getOrCreateResource(this.scene.resources, {
          id: 'ore',
          type: 'ore',
          name: '矿石'
        });
        oreResource.count++;
        gameLog({ text: "获得了一块矿石", type: "ITEM" });        // 如果库存耗尽，发出提示
        if (!hasStock(this.scene.stock, 'ore')) {
          gameLog({ text: "这片区域的矿石已经被开采殆尽了", type: "SYSTEM" });
        }
      } catch (error) {
        gameLog({ text: "这里已经没有可以开采的矿石了", type: "SYSTEM" });
      }
    },

    getActionConfig() {
      const equipment = useEquipmentStore();
      return [
        {
          name: 'chopWood',
          text: '砍伐',
          duration: 5,
          energyCost: 15, // 砍树需要较多体力
          handler: async () => await this.withEnergyCost(15, async () => await this.chopWood()),
          disabled: equipment.axeCount === 0,
          tooltip: '需要斧头才能砍伐'
        },
        {
          name: 'explore',
          text: '探索',
          duration: 3,
          energyCost: 10, // 探索消耗中等体力
          handler: async () => await this.withEnergyCost(10, async () => await this.explore())
        },
        {
          name: 'mineOre',
          text: '采矿',
          duration: 3,
          energyCost: 20, // 采矿需要大量体力
          handler: async () => await this.withEnergyCost(20, async () => await this.mineOre())
        }
      ];
    },

    initializeScene() {
      this.scene.actions = this.getActionConfig();

      // 初始化场景时设置默认库存
      if (!this.scene.stock) {
        this.scene.stock = JSON.parse(JSON.stringify(INITIAL_STOCK));
      }
    }
  },

  persist: true
})
