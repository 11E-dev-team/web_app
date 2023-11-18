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

import { ref, Ref } from 'vue';

export const useCanvasStore = defineStore('canvas', {
  state: () => {
    return {
      canvas: undefined as fabric.Canvas | undefined,
      canvas_json: undefined as string | undefined,
      lines: [] as ILine[],
      currentLine: {
        id: '1',
        points: [],
        color: 'black',
        width: 0,
      } as ILine,
      rectangles: [] as IRectangle[],
      ellipses: [] as IEllipse[],
      arrows: [] as IArrow[],
      texts: [] as IText[],
      currentText: {
        x: 0,
        y: 0,
        text: '',
      } as IText,
      currentShape: {} as fabric.Rect,
      currentId: 1 as number,
    }
  },
})

import { Tools, Tools_, Shapes, Shapes_ } from '@/store/public_interfaces'
import { fabric } from 'fabric'

export const useCanvasStateStore = defineStore('canvas-state', {
  state: () => {
    return {
      isDrawing: false as boolean,
      isErasing: false as boolean,
      isTexting: false as boolean,
      selectedTool: Tools.Cursor as Tools_,
      selectedShape: Shapes.Rectangle as Shapes_,
      pointer: new fabric.Circle({
        left: 0,
        top: 0,
        radius: 0,
        fill: 'grey',
        stroke: 'grey',
      }) as fabric.Circle,
    }
  },
})
