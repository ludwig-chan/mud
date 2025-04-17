import { defineStore } from 'pinia'

type Gender = 'male' | 'female'

interface CharacterState {
  name: string
  avatar: string
  age: number
  gender: Gender
  health: number
  energy: number
  satiety: number
  mood: number
  hygiene: number
  mana: number
}

export const useCharacterStore = defineStore('character', {
  state: (): CharacterState => ({    name: '无名氏',
    avatar: '👤',
    age: 18,
    gender: 'male',
    health: 55,
    energy: 50,
    satiety: 45,
    mood: 60,
    hygiene: 70,
    mana: 0
  }),

  actions: {
    updateName(newName: string) {
      this.name = newName
    },
    updateAvatar(newAvatar: string) {
      this.avatar = newAvatar
    },
    updateStats(stats: Partial<CharacterState>) {
      Object.assign(this, stats)
    }
  }
})
