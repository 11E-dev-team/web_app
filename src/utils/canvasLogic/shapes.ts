import { storeToRefs } from 'pinia';
import { useCanvasStore, useCanvasStateStore, Shapes } from '@/store';
import { Rectangle, Ellipse, Arrow } from '@/store/public_interfaces';
const canvasStore = useCanvasStore();
const canvasStateStore = useCanvasStateStore();
const { currentShape, rectangles, ellipses, arrows } = storeToRefs(canvasStore);
const { selectedShape, isDrawing, pointer } = storeToRefs(canvasStateStore);
import Konva from 'konva';

function abs(x: number): number {
  return x < 0 ? -x : x;
}

export function startShape(evt: Konva.KonvaEventObject<MouseEvent>): void {
  switch (selectedShape.value) {
    case Shapes.Rectangle:
      startRectangle(evt);
      break;
    case Shapes.Ellipse:
      startEllipse(evt);
      break;
    case Shapes.Arrow:
      startArrow(evt);
      break;
  }
}

function startRectangle(evt: Konva.KonvaEventObject<MouseEvent>): void {
  isDrawing.value = true;
  currentShape.value = {
    x: evt.evt.offsetX,
    y: evt.evt.offsetY,
    width: 0,
    height: 0,
    type: 'Rectangle',
  } as Rectangle;
  rectangles.value.push({ ...currentShape.value });
}

function startEllipse(evt: Konva.KonvaEventObject<MouseEvent>): void {
  isDrawing.value = true;
  currentShape.value = {
    x: evt.evt.offsetX,
    y: evt.evt.offsetY,
    radius: {
      x: 0,
      y: 0,
    },
    type: 'Ellipse',
  } as Ellipse;
  pointer.value.x = evt.evt.offsetX;
  pointer.value.y = evt.evt.offsetY;
  pointer.value.radius = 1;
  ellipses.value.push({ ...currentShape.value });
}

function startArrow(evt: Konva.KonvaEventObject<MouseEvent>): void {
  isDrawing.value = true;
  currentShape.value = {
    points: [evt.evt.offsetX, evt.evt.offsetY],
    color: 'black',
    width: 1,
    type: 'Arrow',
  } as Arrow;
  arrows.value.push({ ...currentShape.value });
}

export function shape(evt: Konva.KonvaEventObject<MouseEvent>): void {
  switch (selectedShape.value) {
    case Shapes.Rectangle:
      rectangle(evt);
      break;
    case Shapes.Ellipse:
      ellipse(evt);
      break;
    case Shapes.Arrow:
      arrow(evt);
      break;
  }
}

function rectangle(evt: Konva.KonvaEventObject<MouseEvent>): void {
  if (!isDrawing.value) return;
  if (currentShape.value.type !== 'Rectangle') return;
  currentShape.value.width = evt.evt.offsetX - currentShape.value.x;
  currentShape.value.height = evt.evt.offsetY - currentShape.value.y;
  rectangles.value.pop();
  rectangles.value.push({ ...currentShape.value });
}

function ellipse(evt: Konva.KonvaEventObject<MouseEvent>): void {
  if (!isDrawing.value) return;
  if (currentShape.value.type !== 'Ellipse') return;
  currentShape.value.radius.x = abs(evt.evt.offsetX - currentShape.value.x);
  currentShape.value.radius.y = abs(evt.evt.offsetY - currentShape.value.y);
  ellipses.value.pop();
  ellipses.value.push({ ...currentShape.value });
  // TODO: Somehow display if radius.x === radius.y (if ellipse is a circle)
}

function arrow(evt: Konva.KonvaEventObject<MouseEvent>): void {
  if (!isDrawing.value) return;
  if (currentShape.value.type !== 'Arrow') return;
  currentShape.value.points[2] = evt.evt.offsetX;
  currentShape.value.points[3] = evt.evt.offsetY;
  arrows.value.pop();
  arrows.value.push({ ...currentShape.value });
}

export function endShape(evt: Konva.KonvaEventObject<MouseEvent>): void {
  switch (selectedShape.value) {
    case Shapes.Rectangle:
      endRectangle(evt);
      break;
    case Shapes.Ellipse:
      endEllipse(evt);
      break;
    case Shapes.Arrow:
      endArrow(evt);
      break;
  }
}

function endRectangle(evt: Konva.KonvaEventObject<MouseEvent>): void {
  if (!isDrawing.value) return;
  isDrawing.value = false;
  if (currentShape.value.type !== 'Rectangle') return;
  rectangles.value.pop();
  rectangles.value.push({ ...currentShape.value });
  currentShape.value = {} as Rectangle;
}

function endEllipse(evt: Konva.KonvaEventObject<MouseEvent>): void {
  if (!isDrawing.value) return;
  isDrawing.value = false;
  if (currentShape.value.type !== 'Ellipse') return;
  ellipses.value.pop();
  ellipses.value.push({ ...currentShape.value });
  currentShape.value = {} as Ellipse;
  pointer.value.x = 0;
  pointer.value.y = 0;
  pointer.value.radius = 0;
}


function endArrow(evt: Konva.KonvaEventObject<MouseEvent>): void {
  if (!isDrawing.value) return;
  isDrawing.value = false;
  if (currentShape.value.type !== 'Arrow') return;
  arrows.value.pop();
  arrows.value.push({ ...currentShape.value });
  currentShape.value = {} as Arrow;
}
