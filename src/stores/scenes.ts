import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useBaseSceneStore } from './scenes/base';
import { useForestSceneStore } from './scenes/forest';
import type { GameScene } from './scenes/types';

export const useScenesStore = defineStore('scenes', {
  state: () => ({
    currentSceneId: 'base'
  }),

  getters: {
    currentScene(): GameScene {
      const baseScene = useBaseSceneStore();
      const forestScene = useForestSceneStore();
      
      switch (this.currentSceneId) {
        case 'base':
          return baseScene.scene;
        case 'forest':
          return forestScene.scene;
        default:
          return baseScene.scene;
      }
    },

    currentResources(): GameScene['resources'] {
      return this.currentScene.resources;
    },

    currentActions(): GameScene['actions'] {
      return this.currentScene.actions;
    }
  },

  actions: {
    initializeScenes() {
      const baseScene = useBaseSceneStore();
      const forestScene = useForestSceneStore();
      
      baseScene.initializeScene();
      forestScene.initializeScene();
    }
  },

  persist: true
});