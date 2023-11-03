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

import Email from '@/utils/email'
import Password from '@/utils/password'

export interface User {
  id?: number | null,
  email: Email,
}

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      user: null as User | null,
      newUser: null as User | null,
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

export interface Line {
  points: number[];
  color: string;
  width: number;
}

enum shapes {
  Rectangle = 'Rectangle',
  Ellipse = 'Ellipse',
  Arrow = 'Arrow',
};

export const Shapes: Readonly<typeof shapes> = Object.freeze(shapes);

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  type: 'Rectangle';
}

export interface Ellipse {
  x: number;
  y: number;
  radius: {
    x: number;
    y: number;
  };
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  type: 'Ellipse';
}

export interface Circle {
  x: number;
  y: number;
  radius: number;
  fill?: string;
  stroke?: string;
}

export interface Arrow {
  points: number[];
  color: string;
  width: number;
  type: 'Arrow';
}

export const useCanvasStore = defineStore('canvas', {
  state: () => {
    return {
      lines: [] as Line[],
      currentLine: {
        points: [],
        color: 'black',
        width: 1,
      } as Line,
      rectangles: [] as Rectangle[],
      ellipses: [] as Ellipse[],
      arrows: [] as Arrow[],
      currentShape: {} as Rectangle | Ellipse | Arrow,
    }
  },
})

export const useCanvasStateStore = defineStore('canvas-state', {
  state: () => {
    return {
      isDrawing: false as boolean,
      isErasing: false as boolean,
      selectedShape: Shapes.Rectangle as shapes,
      pointer: {
        x: 0,
        y: 0,
        radius: 0,
        fill: 'grey',
        stroke: 'grey',
      } as Circle,
    }
  },
})
