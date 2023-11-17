import { storeToRefs } from 'pinia';
import { useCanvasStore, useCanvasStateStore, Shapes } from '@/store';
import { IRectangle, IEllipse, IArrow } from '@/store/public_interfaces';
const canvasStore = useCanvasStore();
const canvasStateStore = useCanvasStateStore();
const { currentId, currentShape, rectangles, ellipses, arrows } = storeToRefs(canvasStore);
const { selectedShape, isDrawing, pointer } = storeToRefs(canvasStateStore);
import { fabric } from 'fabric';

function abs(x: number): number {
  return x < 0 ? -x : x;
}

export function startShape(evt: fabric.IEvent): void {
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

function startRectangle(evt: fabric.IEvent): void {
  if (!evt.pointer) return;
  const { x, y } = evt.pointer;
  isDrawing.value = true;
  currentId.value += 1;
  currentShape.value = {
    id: currentId.value.toString(),
    x: x,
    y: y,
    width: 0,
    height: 0,
    type: 'Rectangle',
  } as IRectangle;
  rectangles.value.push({ ...currentShape.value });
}

function startEllipse(evt: fabric.IEvent): void {
  if (!evt.pointer) return;
  const { x, y } = evt.pointer;
  isDrawing.value = true;
  currentId.value += 1;
  currentShape.value = {
    id: currentId.value.toString(),
    x: x,
    y: y,
    radius: {
      x: 0,
      y: 0,
    },
    type: 'Ellipse',
  } as IEllipse;
  pointer.value.x = x;
  pointer.value.y = y;
  pointer.value.radius = 1;
  ellipses.value.push({ ...currentShape.value });
}

function startArrow(evt: fabric.IEvent): void {
  if (!evt.pointer) return;
  const { x, y } = evt.pointer;
  isDrawing.value = true;
  currentId.value += 1;
  currentShape.value = {
    id: currentId.value.toString(),
    points: [x, y],
    color: 'black',
    width: 1,
    type: 'Arrow',
  } as IArrow;
  arrows.value.push({ ...currentShape.value });
}

export function shape(evt: fabric.IEvent): void {
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

function rectangle(evt: fabric.IEvent): void {
  if (!evt.pointer) return;
  const { x, y } = evt.pointer;
  if (!isDrawing.value) return;
  if (currentShape.value.type !== 'Rectangle') return;
  currentShape.value.width = x - currentShape.value.x;
  currentShape.value.height = y - currentShape.value.y;
  rectangles.value.pop();
  rectangles.value.push({ ...currentShape.value });
}

function ellipse(evt: fabric.IEvent): void {
  if (!evt.pointer) return;
  const { x, y } = evt.pointer;
  if (!isDrawing.value) return;
  if (currentShape.value.type !== 'Ellipse') return;
  currentShape.value.radius.x = abs(x - currentShape.value.x);
  currentShape.value.radius.y = abs(y - currentShape.value.y);
  ellipses.value.pop();
  ellipses.value.push({ ...currentShape.value });
  // TODO: Somehow display if radius.x === radius.y (if ellipse is a circle)
}

function arrow(evt: fabric.IEvent): void {
  if (!evt.pointer) return;
  const { x, y } = evt.pointer;
  if (!isDrawing.value) return;
  if (currentShape.value.type !== 'Arrow') return;
  currentShape.value.points[2] = x;
  currentShape.value.points[3] = y;
  arrows.value.pop();
  arrows.value.push({ ...currentShape.value });
}

export function endShape(evt: fabric.IEvent): void {
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

function endRectangle(evt: fabric.IEvent): void {
  if (!isDrawing.value) return;
  isDrawing.value = false;
  if (currentShape.value.type !== 'Rectangle') return;
  rectangles.value.pop();
  rectangles.value.push({ ...currentShape.value });
  currentShape.value = {} as IRectangle;
}

function endEllipse(evt: fabric.IEvent): void {
  if (!isDrawing.value) return;
  isDrawing.value = false;
  if (currentShape.value.type !== 'Ellipse') return;
  ellipses.value.pop();
  ellipses.value.push({ ...currentShape.value });
  currentShape.value = {} as IEllipse;
  pointer.value.x = 0;
  pointer.value.y = 0;
  pointer.value.radius = 0;
}


function endArrow(evt: fabric.IEvent): void {
  if (!isDrawing.value) return;
  isDrawing.value = false;
  if (currentShape.value.type !== 'Arrow') return;
  arrows.value.pop();
  arrows.value.push({ ...currentShape.value });
  currentShape.value = {} as IArrow;
}
