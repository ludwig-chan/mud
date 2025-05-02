import { defineStore } from 'pinia';
import { computed } from 'vue';
import type { GameScene } from './types';
import { gameLog } from '../../utils/eventBus';
import { useEquipmentStore } from '../equipment';
import { useCharacterStore } from '../character';

// 定义基地初始库存
const INITIAL_STOCK = {
  wood: {
    current: 0,
    max: 100
  },
  ore: {
    current: 0,
    max: 100
  },
  branch: {
    current: 0,
    max: 100
  }
} as const;

export const useBaseSceneStore = defineStore('baseScene', {
  state: () => ({
    scene: {
      id: 'base',
      name: '基地',
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
    // 重置场景状态
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

    async craftAxe() {
      const equipment = useEquipmentStore();
      const branchResource = this.scene.resources.find((r) => r.type === 'branch');
      const oreResource = this.scene.resources.find((r) => r.type === 'ore');

      if (!branchResource || !oreResource) {
        gameLog({ text: "资源类型错误", type: "SYSTEM" });
        return;
      }

      if (branchResource.count >= 3 && oreResource.count >= 2) {
        branchResource.count -= 3;
        oreResource.count -= 2;
        equipment.craftAxe({ branch: 3, ore: 2 });
        gameLog({ text: "成功打造了一把斧头！", type: "ITEM" });
      } else {
        gameLog({ text: "资源不足，无法打造斧头", type: "SYSTEM" });
      }
    },

    getActionConfig() {
      const equipment = useEquipmentStore();
      return [{
        name: 'craftAxe',
        text: '打造斧头',
        duration: 10,
        energyCost: 25, // 制作工具需要大量体力
        handler: async () => await this.withEnergyCost(25, async () => await this.craftAxe()),
        disabled: () => {
          const store = useBaseSceneStore();
          const branchResource = store.scene.resources.find((r) => r.type === 'branch');
          const oreResource = store.scene.resources.find((r) => r.type === 'ore');
          return !branchResource || !oreResource || branchResource.count < 3 || oreResource.count < 2;
        },
        tooltip: '需要：树枝x3 矿石x2'
      }];
    },

    initializeScene() {
      this.scene.actions = this.getActionConfig();
    }
  },

  persist: true
});
