import Email from '@/utils/email'

export enum Tools_ {
  Cursor = 'Cursor',
  Pen = 'Pen',
  Eraser = 'Eraser',
  Shapes = 'Shapes',
  Text = 'Text',
}

export const Tools: Readonly<typeof Tools_> = Object.freeze(Tools_);

export enum Shapes_ {
  Rectangle = 'Rectangle',
  Ellipse = 'Ellipse',
  Arrow = 'Arrow',
};

export const Shapes: Readonly<typeof Shapes_> = Object.freeze(Shapes_);

export interface IUser {
  id?: number | null,
  email: Email,
}

export interface ILine {
  id: string;
  points: number[];
  color: string;
  width: number;
}

export interface IRectangle {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  type: 'Rectangle';
}

export interface IEllipse {
  id: string;
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

export interface ICircle {
  id: string;
  x: number;
  y: number;
  radius: number;
  fill?: string;
  stroke?: string;
}

export interface IArrow {
  id: string;
  points: number[];
  color: string;
  width: number;
  type: 'Arrow';
}

export interface IText {
  id: string;
  x: number;
  y: number;
  text: string;
}
