import fabric from "fabric/fabric-impl";
import { Canvas, CanvasMouse, IMouseEvent, IWheelEvent } from "./Canvas";
import FabricDrawer from "./FabricDrawer";
import { CanvasId } from "@/shared/types";
import { Tools, Tools_ } from "@/shared/interfaces";
import Conference from "./Conference";

export class FabricCanvas extends Canvas {
  private _canvas: fabric.Canvas | undefined;

  private _drawer: FabricDrawer | undefined;

  constructor(id: CanvasId, canvas?: fabric.Canvas, conference?: Conference) { //TODO: make it possible to specify canvas later
    super(id);

    this._canvas = canvas;
    if (this._canvas) {
      this._drawer = new FabricDrawer(this._canvas, this._canvasMouse.currentColor);
    };
  };
  
  public mouseDown(event: IMouseEvent): void {
    this._canvasMouse.down(event);
    if (this._canvasMouse.currentObject) {
      this._drawer?.add(this._canvasMouse.currentObject);
    };
  };

  public mouseMove(event: IMouseEvent): void {
    this._canvasMouse.move(event);
    if (this._canvasMouse.currentObject) {
      this._drawer?.change(this._canvasMouse.currentObject);
    };
  };

  public mouseUp(event: IMouseEvent): void {
    this._canvasMouse.up(event);
    if (this._canvasMouse.currentObject) {
      this._drawer?.end(this._canvasMouse.currentObject);
    };
  };

  public deleteSelected(): void {
    const activeObjects = this.canvas.getActiveObjects();
    if (!activeObjects) return;
    for (const activeObject of activeObjects) {
      this._canvas?.remove(activeObject);
    };
  };

  public updateSettings(): void {
    if (!this._canvas) return;
    this._canvas
      .freeDrawingBrush.color = this._canvasMouse.currentTool === Tools.Pen
      ? this._canvasMouse.currentColor
      : "transparent";
    
    this._canvas.selection = this._canvasMouse.currentTool === Tools.Cursor;

    this._canvas.isDrawingMode = this._canvasMouse.currentTool !== Tools.Cursor;
  };

  public changeTool(tool: Tools_): void {
    this._canvasMouse.changeTool(tool);
    this.updateSettings();
  };

  public update(receivedData: string): void {
    if (!this._canvas) return;
    console.log('Fabric canvas updating');
    const { canvas, viewport } = JSON.parse(receivedData);
    console.log(canvas, viewport);
    this._canvas.loadFromJSON(canvas, this._canvas.renderAll.bind(this._canvas));
    this._canvas.setViewportTransform(viewport);
    console.log('Fabric canvas updated');
  };

  public set canvas(canvas: fabric.Canvas) {
    this._canvas = canvas;
    this._drawer = new FabricDrawer(canvas, this._canvasMouse.currentColor);
  };

  public get canvas(): fabric.Canvas {
    return this._canvas as fabric.Canvas;
  };

  public set canvasMouse(canvasMouse: CanvasMouse) {
    this._canvasMouse = canvasMouse;
    if (this._drawer) this._drawer.strokeColor = canvasMouse.currentColor;
  };

  public broadcast(): void {
    console.log(`Started broadcast from ${this.id}`);
    this.sendToConference({
      "drawing": JSON.stringify({
        "canvas": this._canvas?.toDatalessJSON(),
        "viewport": this._canvas?.viewportTransform,
      })
    });
  };
};
