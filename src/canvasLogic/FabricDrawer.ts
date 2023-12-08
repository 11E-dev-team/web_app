import { fabric } from "fabric";

import { CanvasObject, CanvasObjects, Shape, Text } from "./Objects";
import { Shapes } from "@/shared/interfaces";
import { IncorrectShapeError, IncorrectToolError } from "@/shared/errors";

export default class FabricDrawer {
  protected canvas: fabric.Canvas;
  protected currentFabricShape: fabric.Object | fabric.Line | fabric.Ellipse | undefined;

  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas;
    this.currentFabricShape = undefined;
  };

  public add(object: CanvasObject) {
    switch (object.objectType) {
      case CanvasObjects.Shape:
        this.addShape(object as Shape);
        break;
      case CanvasObjects.Text:
        this.addText(object as Text);
        break;
      default:
        throw new IncorrectToolError(CanvasObjects.Shape);
    }
  };

  public change(object: CanvasObject) {
    switch (object.objectType) {
      case CanvasObjects.Shape:
        this.changeShape(object as Shape);
        break;
      default:
        throw new IncorrectToolError(CanvasObjects.Shape);
    };
  };

  public end(object: CanvasObject) {
    switch (object.objectType) {
      case CanvasObjects.Shape:
        this.endShape(object as Shape);
        break;
      default:
        throw new IncorrectToolError(CanvasObjects.Shape);
    };
  };

  private addShape(shape: Shape): void {
    switch (shape.type) {
      case Shapes.Rectangle:
        this.currentFabricShape = new fabric.Rect({
          left: shape.initialX,
          top: shape.initialY,
          width: 0,
          height: 0,
          borderColor: 'black',
          fill: 'transparent',
        });
        break;
      case Shapes.Ellipse:
        this.currentFabricShape = new fabric.Ellipse({
          left: shape.initialX,
          top: shape.initialY,
          rx: 0,
          ry: 0,
          stroke: 'black',
          fill: 'transparent',
          strokeWidth: 1,
        });
        break;
      case Shapes.Line:
        this.currentFabricShape = new fabric.Line([
            shape.initialX,
            shape.initialY,
            shape.directionX,
            shape.directionY,
        ], {
          stroke: 'black',
        });
        break;
      case Shapes.Arrow:
        this.currentFabricShape = new fabric.Line([
          shape.initialX,
          shape.initialY,
          shape.directionX,
          shape.directionY,
        ], {
          stroke: 'black',
          fill: 'black',
        });
        break;
      default:
        throw new IncorrectShapeError(shape.type);
    };
    this.canvas.add(this.currentFabricShape);
    this.canvas.renderAll();
  };

  private addText(text: Text): void {
    this.currentFabricShape = new fabric.IText(text.value, {
      left: text.initialX,
      top: text.initialY,
    });
    this.canvas.add(this.currentFabricShape);
    this.canvas.renderAll();
    this.canvas.setActiveObject(this.currentFabricShape);
    if (this.currentFabricShape instanceof fabric.IText) this.currentFabricShape.enterEditing();
  };

   private changeShape(shape: Shape): void {
    switch (shape.type) {
      case Shapes.Rectangle:
        if (!(this.currentFabricShape instanceof fabric.Rect)) return;
        this.currentFabricShape?.set({
          left: shape.initialX,
          top: shape.initialY,
          width: shape.directionX,
          height: shape.directionY,
        });
        break;
      case Shapes.Ellipse:
        if (!(this.currentFabricShape instanceof fabric.Ellipse)) return;
        this.currentFabricShape?.set({
          left: shape.initialX,
          top: shape.initialY,
          rx: shape.directionX,
          ry: shape.directionY,
        });
        break;
      case Shapes.Line: case Shapes.Arrow:
        if (!(this.currentFabricShape instanceof fabric.Line)) return;
        this.currentFabricShape?.set({
          x1: shape.initialX,
          y1: shape.initialY,
          x2: shape.directionX,
          y2: shape.directionY,
        });
        break;
      default:
        throw new IncorrectShapeError(shape.type);
    }
    
    this.canvas.renderAll();
  };

  private endShape(shape: Shape): void {
    this.changeShape(shape);
    if (this.currentFabricShape) this.canvas.setActiveObject(this.currentFabricShape);
    this.currentFabricShape = undefined;
  };
};
