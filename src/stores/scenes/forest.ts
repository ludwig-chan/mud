import { defineStore } from 'pinia';
import type { GameScene, GameResource } from './types';
import { gameLog } from '../../utils/eventBus';
import { useEquipmentStore } from '../equipment';

export const useForestSceneStore = defineStore('forestScene', {
  state: () => ({
    scene: {
      id: 'forest',
      name: '树林',
      resources: [],
      actions: [],
      stock: {
        wood: {
          current: 50,   // 初始木材储量
          max: 50        // 最大木材储量
        },
        ore: {
          current: 30,   // 初始矿石储量
          max: 30        // 最大矿石储量
        },
        branch: {
          current: 40,   // 初始树枝储量
          max: 40        // 最大树枝储量
        },
        apple: {
          current: 20,   // 初始苹果储量
          max: 20        // 最大苹果储量
        }
      }
    } as GameScene
  }),

  getters: {
    resources: (state) => state.scene.resources,
    actions: (state) => state.scene.actions,
    // 判断库存是否为空
    isStockEmpty: (state) => {
      return Object.values(state.scene.stock).every(resource => resource.current <= 0);
    }
  },

  actions: {
    /**
     * @internal 尝试从库存中获取指定数量的资源
     */
    async _getStockAmount(type: string, amount: number = 1): Promise<number> {
      return new Promise((resolve, reject) => {
        const stock = this.scene.stock[type];
        if (!stock || stock.current <= 0) {
          reject('库存不足');
          return;
        }

        const actualAmount = Math.min(stock.current, amount);
        // 自动扣减库存
        this.scene.stock[type].current -= actualAmount;
        resolve(actualAmount);
      });
    },

    /**
     * @internal 检查指定资源是否可用
     */
    _hasStock(type: string): boolean {
      const stock = this.scene.stock[type];
      return stock && stock.current > 0;
    },

    /**
     * @internal 获取或创建玩家资源
     */
    _getOrCreateResource(resourceInfo: { id: string, type: string, name: string }): GameResource {
      let resource = this.scene.resources.find((r) => r.type === resourceInfo.type);
      if (!resource) {
        resource = { 
          id: resourceInfo.id, 
          type: resourceInfo.type, 
          name: resourceInfo.name, 
          count: 0 
        } as GameResource;
        this.scene.resources.unshift(resource);
      }
      return resource;
    },

    /**
     * @internal 根据当前库存状态计算探索可能获得的资源
     */
    _calculateExploreResources() {
      const possibleResources = [
        { id: 'branch', type: 'branch' as const, name: '树枝' },
        { id: 'ore', type: 'ore' as const, name: '矿石' },
        { id: 'apple', type: 'apple' as const, name: '苹果' }
      ];

      // 只选择还有库存的资源
      const availableResources = possibleResources.filter(resource => 
        this._hasStock(resource.type)
      );

      if (availableResources.length === 0) {
        return [];
      }

      // 根据剩余比例计算每种资源的权重
      const resourcesWithWeight = availableResources.map(resource => {
        const stock = this.scene.stock[resource.type];
        const ratio = stock.current / stock.max;
        const weight = Math.pow(ratio, 0.7) * (0.7 + Math.random() * 0.3);

        // 计算预期获取数量
        const baseAmount = Math.ceil(3 * ratio);
        const bonus = ratio > 0.8 && Math.random() < 0.3 ? 1 : 0;
        const expectedAmount = baseAmount + Math.floor(Math.random() * 2) + bonus;

        return { 
          ...resource, 
          weight,
          expectedAmount 
        };
      });

      // 按权重排序并选择前1-3种资源
      resourcesWithWeight.sort((a, b) => b.weight - a.weight);
      const maxTypes = Math.min(3, resourcesWithWeight.length);
      const resourceTypesToGet = Math.floor(Math.random() * maxTypes) + 1;
      
      return resourcesWithWeight.slice(0, resourceTypesToGet);
    },

    // 公开的方法
    clearResources() {
      this.scene.resources = []
    },

    async chopWood() {
      try {
        const amount = await this._getStockAmount('wood');
        const woodResource = this._getOrCreateResource({ 
          id: 'wood', 
          type: 'wood', 
          name: '木材' 
        });
        woodResource.count++;
        gameLog({ text: "获得了一个木材", type: "ITEM" });
        
        // 如果库存耗尽，发出提示
        if (this.scene.stock.wood.current <= 0) {
          gameLog({ text: "这片区域的树木已经被砍伐殆尽了", type: "SYSTEM" });
        }
      } catch (error) {
        gameLog({ text: "这里已经没有可以砍伐的树木了", type: "SYSTEM" });
      }
    },
    async explore() {
      // 检查是否还有库存
      if (this.isStockEmpty) {
        gameLog({ text: "这片区域已经被探索殆尽了，也许应该等待资源恢复", type: "ITEM" });
        return;
      }

      // 计算本次探索可能获得的资源
      const selectedResources = this._calculateExploreResources();
      
      if (selectedResources.length === 0) {
        gameLog({ text: "探索了一圈，但是什么都没有发现", type: "ITEM" });
        return;
      }

      const gainedResources: string[] = [];

      // 处理每种被选中的资源
      for (const resource of selectedResources) {
        try {
          // 尝试获取资源
          const amount = await this._getStockAmount(resource.type, resource.expectedAmount);

          // 获取或创建资源
          const playerResource = this._getOrCreateResource(resource);
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

      if (this.isStockEmpty) {
        gameLog({ text: "这片区域已经被探索殆尽了", type: "SYSTEM" });
      }
    },

    async mineOre() {
      try {
        const amount = await this._getStockAmount('ore');
        const oreResource = this._getOrCreateResource({ 
          id: 'ore', 
          type: 'ore', 
          name: '矿石' 
        });
        oreResource.count++;
        gameLog({ text: "获得了一块矿石", type: "ITEM" });

        // 如果库存耗尽，发出提示
        if (this.scene.stock.ore.current <= 0) {
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
          handler: async () => await this.chopWood(),
          disabled: equipment.axeCount === 0,
          tooltip: '需要斧头才能砍伐'
        },
        {
          name: 'explore',
          text: '探索',
          duration: 3,
          handler: async () => await this.explore()
        },
        {
          name: 'mineOre',
          text: '采矿',
          duration: 3,
          handler: async () => await this.mineOre()
        }
      ];
    },
    initializeScene() {
      this.scene.actions = this.getActionConfig();

      // 初始化场景时设置默认库存
      if (!this.scene.stock) {
        this.scene.stock = {
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
        };
      }
    },
  },

  persist: true
});
