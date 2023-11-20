import { storeToRefs } from 'pinia';
import { useCanvasStore, useCanvasStateStore } from '@/store';
const canvasStore = useCanvasStore();
const canvasStateStore = useCanvasStateStore();
const { canvas, currentShape, additionalShapes } = storeToRefs(canvasStore);
const { isDrawing } = storeToRefs(canvasStateStore);
import { fabric } from 'fabric';

export function startEllipse(evt: fabric.IEvent): void {
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

  additionalShapes.value.push(new fabric.Circle({
    left: x - 2,
    top: y - 2,
    radius: 2,
    fill: 'grey',
    stroke: 'grey',
  }));

  canvas.value.add(currentShape.value);
  canvas.value.add(additionalShapes.value[additionalShapes.value.length - 1]);
  canvas.value.renderAll();
}

export function ellipse(evt: fabric.IEvent): void {
  if (!evt.pointer) return;
  const { x, y } = evt.pointer;
  if (!isDrawing.value) return;
  if (!(currentShape.value instanceof fabric.Ellipse)) return;
  const pointer = additionalShapes.value[additionalShapes.value.length - 1];
  const rx = pointer.left ? pointer.left - x + 2 : 0;
  const ry = pointer.top ? pointer.top - y + 2 : 0;
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

export function endEllipse(evt: fabric.IEvent): void {
  isDrawing.value = false;
  canvas.value?.remove(additionalShapes.value[additionalShapes.value.length - 1]);
  additionalShapes.value.pop();
  canvas.value?.renderAll();
}
