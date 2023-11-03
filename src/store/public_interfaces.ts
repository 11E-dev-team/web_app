import Email from '@/utils/email'

export interface User {
  id?: number | null,
  email: Email,
}

export interface Line {
  points: number[];
  color: string;
  width: number;
}

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

export interface Text {
  x: number;
  y: number;
  text: string;
}
