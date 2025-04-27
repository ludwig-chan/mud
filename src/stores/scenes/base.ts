import { defineStore } from 'pinia';
import { computed } from 'vue';
import type { GameScene } from './types';
import { gameLog } from '../../utils/eventBus';
import { useEquipmentStore } from '../equipment';

export const useBaseSceneStore = defineStore('baseScene', {
  state: () => ({
    scene: {
      id: 'base',
      name: '基地',
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
        handler: async () => await this.craftAxe(),        disabled: () => {
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
