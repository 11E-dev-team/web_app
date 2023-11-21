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

import {
  IUser,
  ILine,
  IRectangle,
  IEllipse,
  ICircle,
  IArrow,
  IText,
} from '@/store/public_interfaces'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      user: null as IUser | null,
      newUser: null as IUser | null,
      canvasId: 1 as number,
      mainSocket: new WebSocket("ws://172.20.21.66:8179/ws/canvas/0") as WebSocket,
      socketsInSession: [
        new WebSocket("ws://172.20.21.66:8179/ws/canvas/0"),
        new WebSocket("ws://172.20.21.66:8179/ws/canvas/1"),
        new WebSocket("ws://172.20.21.66:8179/ws/canvas/2"),
        new WebSocket("ws://172.20.21.66:8179/ws/canvas/3"),
        new WebSocket("ws://172.20.21.66:8179/ws/canvas/4"),
        new WebSocket("ws://172.20.21.66:8179/ws/canvas/5"),
      ] as WebSocket[],
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

import { Tools, Tools_, Shapes, Shapes_ } from '@/store/public_interfaces'
import { fabric } from 'fabric'

export const useCanvasStateStore = defineStore('canvas-state', {
  state: () => {
    return {
      isDrawing: false as boolean,
      selectedTool: Tools.Cursor as Tools_,
      selectedShape: Shapes.Rectangle as Shapes_,
      selectedColor: [
        '#',
        Math.floor(9 * Math.random()),
        Math.floor(9 * Math.random()),
        Math.floor(9 * Math.random()),
        Math.floor(9 * Math.random()),
        Math.floor(9 * Math.random()),
        Math.floor(9 * Math.random()),
      ].join("") as string,
    }
  },
})
