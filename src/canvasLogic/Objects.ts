import { Shapes_, Shapes } from "@/shared/interfaces";

interface IPointer {
  x: number;
  y: number;
}

enum CanvasObjects_ {
  Shape = 'Shape',
  Text = 'Text',
}

export const CanvasObjects: Readonly<typeof CanvasObjects_> = Object.freeze(CanvasObjects_);

export abstract class CanvasObject {
  abstract objectType: CanvasObjects_;
  protected initialPointer: IPointer;

  constructor(initialX: number, initialY: number) {
    this.initialPointer = { x: initialX, y: initialY };
  };

  public get initialX(): number {
    return this.initialPointer.x;
  };

  public get initialY(): number {
    return this.initialPointer.y;
  };
};

export abstract class Shape extends CanvasObject {
  public objectType = CanvasObjects_.Shape;
  abstract type: Shapes_;
  protected directionPointer: IPointer;

  constructor(initialX: number, initialY: number) {
    super(initialX, initialY);
    this.directionPointer = { x: initialX, y: initialY };
  };

  public change(x: number, y: number): void {
    this.directionPointer = { x, y };
  };

  public end(x: number, y: number): void {
    this.directionPointer = { x, y };
  };

  public get directionX(): number {
    return this.directionPointer.x;
  };

  public get directionY(): number {
    return this.directionPointer.y;
  };
};

export class Text extends CanvasObject {
  public objectType = CanvasObjects_.Text;
  private text: string = "";

  constructor(initialX: number, initialY: number) {
    super(initialX, initialY);
  };

  public set value(value: string) {
    this.text = value;
  };

  public get value(): string {
    return this.text;
  };
};

export class Rectangle extends Shape {
  public type = Shapes.Rectangle;

  public get initialX(): number {
    return Math.min(this.initialPointer.x, this.directionPointer.x);
  };

  public get initialY(): number {
    return Math.min(this.initialPointer.y, this.directionPointer.y);
  };

  public get directionX(): number {
    return Math.abs(this.directionPointer.x - this.initialPointer.x);
  };

  public get directionY(): number {
    return Math.abs(this.directionPointer.y - this.initialPointer.y);
  };
};

export class Ellipse extends Shape {
  public type = Shapes.Ellipse;

  public get directionX(): number {
    return Math.abs(this.directionPointer.x - this.initialPointer.x) * 2;
  };

  public get directionY(): number {
    return Math.abs(this.directionPointer.y - this.initialPointer.y) * 2;
  };
};

export class Line extends Shape {
  public type = Shapes.Line;
}

export class Arrow extends Shape {
  public type = Shapes.Arrow;
}
