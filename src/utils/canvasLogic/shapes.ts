import { storeToRefs } from 'pinia';
import { useCanvasStore, useCanvasStateStore } from '@/store';
import { Shapes } from '@/store/public_interfaces';
const canvasStore = useCanvasStore();
const canvasStateStore = useCanvasStateStore();
const { canvas, currentId, currentShape, rectangles, ellipses, arrows } = storeToRefs(canvasStore);
const { selectedShape, isDrawing, pointer } = storeToRefs(canvasStateStore);
import { fabric } from 'fabric';

export function startShape(evt: fabric.IEvent): void {
  switch (selectedShape.value) {
    case Shapes.Rectangle:
      startRectangle(evt);
      break;
    case Shapes.Ellipse:
      startEllipse(evt);
      break;
    // case Shapes.Arrow:
    //   startArrow(evt);
    //   break;
  }
}

function startRectangle(evt: fabric.IEvent): void {
  if (!canvas.value) return;
  if (!evt.pointer) return;
  const { x, y } = evt.pointer;
  isDrawing.value = true;
  currentShape.value = new fabric.Rect({
    left: x,
    top: y,
    width: 0,
    height: 0,
    stroke: 'black',
    fill: 'transparent',
  });
  canvas.value.add(currentShape.value);
  canvas.value.renderAll();
}

function startEllipse(evt: fabric.IEvent): void {
  if (!canvas.value) return;
  if (!evt.pointer) return;
  const { x, y } = evt.pointer;
  isDrawing.value = true;
  currentShape.value = new fabric.Ellipse({
    left: x,
    top: y,
    rx: 0,
    ry: 0,
    stroke: 'black',
    strokeWidth: 1,
    fill: 'transparent',
  });
  canvas.value.add(currentShape.value);
  canvas.value.renderAll();
  pointer.value.set({
    left: x,
    top: y,
    radius: 2,
    fill: 'grey',
    stroke: 'grey',
  })
}

// function startArrow(evt: fabric.IEvent): void {
//   if (!evt.pointer) return;
//   const { x, y } = evt.pointer;
//   isDrawing.value = true;
//   currentId.value += 1;
//   currentShape.value = {
//     id: currentId.value.toString(),
//     points: [x, y],
//     color: 'black',
//     width: 1,
//     type: 'Arrow',
//   } as IArrow;
//   arrows.value.push({ ...currentShape.value });
// }

export function shape(evt: fabric.IEvent): void {
  switch (selectedShape.value) {
    case Shapes.Rectangle:
      rectangle(evt);
      break;
    case Shapes.Ellipse:
      ellipse(evt);
      break;
    // case Shapes.Arrow:
    //   arrow(evt);
    //   break;
  }
}

function rectangle(evt: fabric.IEvent): void {
  if (!evt.pointer) return;
  const { x, y } = evt.pointer;
  if (!isDrawing.value) return;
  const left = currentShape.value.left ? Math.min(currentShape.value.left, x) : x;
  const top = currentShape.value.top ? Math.min(currentShape.value.top, y) : y;
  const width = Math.max(Math.abs(x - left), Math.abs(currentShape.value.left ? currentShape.value.left - left : 0));
  const height = Math.max(Math.abs(y - top), Math.abs(currentShape.value.top ? currentShape.value.top - top : 0));
  currentShape.value.set({
    left: left,
    top: top,
    width: width,
    height: height,
  })

  canvas.value?.renderAll();
}

function ellipse(evt: fabric.IEvent): void {
  if (!evt.pointer) return;
  const { x, y } = evt.pointer;
  if (!isDrawing.value) return;
  const rx = pointer.value.left ? pointer.value.left - x : 0;
  const ry = pointer.value.top ? pointer.value.top - y : 0;
  let left = rx > 0 ? x : x + 2*rx;
  let top = ry > 0 ? y : y + 2*ry;
  currentShape.value.set({
    left: left,
    top: top,
    rx: Math.abs(rx),
    ry: Math.abs(ry),
  })
  canvas.value?.renderAll();
  // TODO: Somehow display if radius.x === radius.y (if ellipse is a circle)
}

// function arrow(evt: fabric.IEvent): void {
//   if (!evt.pointer) return;
//   const { x, y } = evt.pointer;
//   if (!isDrawing.value) return;
//   if (currentShape.value.type !== 'Arrow') return;
//   currentShape.value.points[2] = x;
//   currentShape.value.points[3] = y;
//   arrows.value.pop();
//   arrows.value.push({ ...currentShape.value });
// }

export function endShape(evt: fabric.IEvent): void {
  switch (selectedShape.value) {
    case Shapes.Rectangle:
      endRectangle(evt);
      break;
    case Shapes.Ellipse:
      endEllipse(evt);
      break;
    // case Shapes.Arrow:
    //   endArrow(evt);
    //   break;
  }
}

function endRectangle(evt: fabric.IEvent): void {
  isDrawing.value = false;
}

function endEllipse(evt: fabric.IEvent): void {
  isDrawing.value = false;
  pointer.value.set({
    left: 0,
    top: 0,
    radius: 0,
    fill: 'transparent',
    stroke: 'transparent',
  })
  canvas.value?.renderAll();
}


// function endArrow(evt: fabric.IEvent): void {
//   if (!isDrawing.value) return;
//   isDrawing.value = false;
//   if (currentShape.value.type !== 'Arrow') return;
//   arrows.value.pop();
//   arrows.value.push({ ...currentShape.value });
//   currentShape.value = {} as IArrow;
// }
