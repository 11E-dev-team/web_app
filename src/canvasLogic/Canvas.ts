import { Shapes, Shapes_, Tools, Tools_ } from "@/shared/interfaces";
import { Shape, Rectangle } from "./Objects";
import { IncorrectShapeError, IncorrectToolError } from "@/shared/errors";

export interface IMouseEvent {
  x: number;
  y: number;
};

export class CanvasMouse {
  private selectedTool: Tools_ = Tools.Cursor;
  private selectedShape: Shapes_ = Shapes.Rectangle;
  private currentModifiedObject: Shape | null = null;

  constructor() {};

  public changeTool(tool: Tools_): void {
    this.selectedTool = tool;
  };

  public down(event: IMouseEvent): void {
    switch (this.selectedTool) {
      case Tools.Shapes:
        switch (this.selectedShape) {
          case Shapes.Rectangle:
            this.currentModifiedObject = new Rectangle(event.x, event.y);
            break;
          default:
            throw new IncorrectShapeError(this.selectedShape);
        }
        break;
      default:
        throw new IncorrectToolError(this.selectedTool);
    }
  };

  public move(event: IMouseEvent): void {
    if (!this.currentModifiedObject) return;

    switch (this.selectedTool) {
      case Tools.Shapes:
        switch (this.selectedShape) {
          case Shapes.Rectangle:
            this.currentModifiedObject.change(event.x, event.y);
            break;
          default:
            throw new IncorrectShapeError(this.selectedShape);
        };
        break;
      default:
        throw new IncorrectToolError(this.selectedTool);
    };
  };

  public up(event: IMouseEvent): void {
    if (!this.currentModifiedObject) return;

    switch (this.selectedTool) {
      case Tools.Shapes:
        switch (this.selectedShape) {
          case Shapes.Rectangle:
            this.currentModifiedObject.end(event.x, event.y);
            break;
          default:
            throw new IncorrectShapeError(this.selectedShape);
        };
        break;
      default:
        throw new IncorrectToolError(this.selectedTool);
    };
  };

  public get currentObject(): Shape | null {
    return this.currentModifiedObject;
  };
};
