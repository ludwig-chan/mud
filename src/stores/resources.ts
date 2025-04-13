import { defineStore } from 'pinia'

export const useResourcesStore = defineStore('resources', {
  state: () => ({
    wood: 0,
    fruit: 0,
    ore: 0
  }),
  actions: {
    chopWood() {
      this.wood++
    },
    gatherFruit() {
      this.fruit++
    },
    mineOre() {
      this.ore++
    }
  },
  persist: true
})
