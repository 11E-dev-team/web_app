import fabric from "fabric/fabric-impl";
import { Canvas, IMouseEvent } from "./Canvas";
import FabricDrawer from "./FabricDrawer";
import { ref, Ref } from "vue";
import { CanvasId } from "@/shared/types";
import { Tools, Tools_ } from "@/shared/interfaces";

export class FabricCanvas extends Canvas {
  public canvas: fabric.Canvas;

  private _drawer: FabricDrawer;

  constructor(id: CanvasId, canvas: fabric.Canvas) { //TODO: make it possible to specify canvas later
    super(id);

    this.canvas = canvas;
    this._drawer = new FabricDrawer(canvas);
  };
  
  public mouseDown(event: IMouseEvent): void {
    this._canvasMouse.down(event);
    if (this._canvasMouse.currentObject) {
      this._drawer.add(this._canvasMouse.currentObject);
    };
  };

  public mouseMove(event: IMouseEvent): void {
    this._canvasMouse.move(event);
    if (this._canvasMouse.currentObject) {
      this._drawer.change(this._canvasMouse.currentObject);
    };
  };

  public mouseUp(event: IMouseEvent): void {
    this._canvasMouse.up(event);
    if (this._canvasMouse.currentObject) {
      this._drawer.end(this._canvasMouse.currentObject);
    };
  };

  public updateSettings(): void {
    this.canvas
      .freeDrawingBrush.color = this._canvasMouse.currentTool === Tools.Pen
      ? this._canvasMouse.currentColor
      : "transparent";
    
    this.canvas.selection = this._canvasMouse.currentTool === Tools.Cursor;

    this.canvas.isDrawingMode = this._canvasMouse.currentTool !== Tools.Cursor;
  };

  public changeTool(tool: Tools_): void {
    this._canvasMouse.changeTool(tool);
    this.updateSettings();
  };

  public update(data: string): void {
    console.log('Fabric canvas updating');
    console.log(data);
    this.canvas.loadFromJSON(data, () => {});
    console.log('Fabric canvas updated');
  };
};
