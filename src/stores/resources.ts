import { defineStore } from 'pinia'

export const useResourcesStore = defineStore('resources', {
  state: () => ({
    wood: 0,
    fruit: 0,
    ore: 0
  }),
  actions: {
    async chopWood() {
      this.wood++
    },
    async gatherFruit() {
      this.fruit++
    },
    async mineOre() {
      this.ore++
    }
  },
  persist: true
})
