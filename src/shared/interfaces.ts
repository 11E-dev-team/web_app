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
  Line = 'Line',
  Arrow = 'Arrow',
};

export const Shapes: Readonly<typeof Shapes_> = Object.freeze(Shapes_);

export interface IUser {
  id?: number | null,
  email: Email,
}
