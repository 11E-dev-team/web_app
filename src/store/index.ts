import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  getters: {
    double: state => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    },
  },
})

export interface User {
  id?: number | null,
  email: string,
}

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      user: null as User | null,
    }
  }
})
