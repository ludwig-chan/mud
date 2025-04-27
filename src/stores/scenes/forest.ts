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
      actions: []
    } as GameScene
  }),

  getters: {
    resources: (state) => state.scene.resources,
    actions: (state) => state.scene.actions
  },

  actions: {
    // 清空场景资源
    clearResources() {
      this.scene.resources = []
    },

    async chopWood() {
      let woodResource = this.scene.resources.find((r) => r.type === 'wood');
      if (!woodResource) {
        woodResource = { id: 'wood', type: 'wood', name: '木材', count: 0 };
        this.scene.resources.unshift(woodResource);
      }
      woodResource.count++;
      gameLog({ text: "获得了一个木材", type: "ITEM" });
    },

    async explore() {
      let branchResource = this.scene.resources.find((r) => r.type === 'branch');
      if (!branchResource) {
        branchResource = { id: 'branch', type: 'branch', name: '树枝', count: 0 };
        this.scene.resources.unshift(branchResource);
      }
      const amount = Math.floor(Math.random() * 2) + 1;
      branchResource.count += amount;
      gameLog({ text: `探索发现了${amount}个树枝`, type: "ITEM" });
    },

    async mineOre() {
      let oreResource = this.scene.resources.find((r) => r.type === 'ore');
      if (!oreResource) {
        oreResource = { id: 'ore', type: 'ore', name: '矿石', count: 0 };
        this.scene.resources.unshift(oreResource);
      }
      oreResource.count++;
      gameLog({ text: "获得了一块矿石", type: "ITEM" });
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
    }
  },

  persist: true
});
