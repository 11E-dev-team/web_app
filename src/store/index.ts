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

import Password from '@/utils/password'

import { IUser } from '@/shared/interfaces'

interface IUserIdInConference {
  conferenceId: string
  id: string
  role?: number
}

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      user: undefined as IUser | undefined,
      newUser: undefined as IUser | undefined,
      idInConference: [] as IUserIdInConference[],
      conferenceId: "" as string,
      mainSocket: undefined as WebSocket | undefined,
    }
  }
})

export const useFormStateStore = defineStore('form-state', {
  state: () => {
    return {
      isInteracted: false as boolean,
      emailIsGiven: false as boolean,
      emailIsValid: false as boolean,
      passwordIsGiven: false as boolean,
      passwordIsRepeated: false as boolean,
    }
  }
})

export const useAuthorizationStore = defineStore('authorization', {
  state: () => {
    return {
      password: null as Password | null,
      passwordRepeat: null as Password | null,
    }
  },
})

export const useCanvasStore = defineStore('canvas', {
  state: () => {
    return {
      canvas: undefined as fabric.Canvas | undefined,
      canvas_json: undefined as string | undefined,
      currentShape: {} as fabric.Line | fabric.Rect | fabric.Ellipse | fabric.IText,
      additionalShapes: [] as (fabric.Triangle | fabric.Circle)[],
    }
  },
})

import { Tools, Tools_, Shapes, Shapes_ } from '@/shared/interfaces'
import { fabric } from 'fabric'

export const useCanvasStateStore = defineStore('canvas-state', {
  state: () => {
    return {
      isDrawing: false as boolean,
    }
  },
})
