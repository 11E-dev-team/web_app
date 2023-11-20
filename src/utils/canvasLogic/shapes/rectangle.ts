import { storeToRefs } from 'pinia';
import { useCanvasStore, useCanvasStateStore } from '@/store';
const canvasStore = useCanvasStore();
const canvasStateStore = useCanvasStateStore();
const { canvas, currentShape, additionalShapes } = storeToRefs(canvasStore);
const { isDrawing } = storeToRefs(canvasStateStore);
import { fabric } from 'fabric';

export function startRectangle(evt: fabric.IEvent): void {
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
  additionalShapes.value.push(new fabric.Circle({
    left: x,
    top: y,
    radius: 0,
  }))
  canvas.value.add(currentShape.value);
  canvas.value.renderAll();
}

export function rectangle(evt: fabric.IEvent): void {
  if (!evt.pointer) return;
  const { x, y } = evt.pointer;
  if (!isDrawing.value) return;
  if (!(currentShape.value instanceof fabric.Rect)) return;
  const  { left, top } = additionalShapes.value[additionalShapes.value.length - 1]
  const figLeft = left ? Math.min(left, x) : x;
  const figTop = top ? Math.min(top, y) : y;
  const width = Math.max(Math.abs(x - (left ? left : 0)), Math.abs(currentShape.value.left ? currentShape.value.left - (left ? left : 0) : 0));
  const height = Math.max(Math.abs(y - (top ? top : 0)), Math.abs(currentShape.value.top ? currentShape.value.top - (top ? top : 0) : 0));
  currentShape.value.set({
    left: figLeft,
    top: figTop,
    width: width,
    height: height,
  })

  canvas.value?.renderAll();
}

export function endRectangle(evt: fabric.IEvent): void {
  isDrawing.value = false;
  canvas.value?.remove(additionalShapes.value[additionalShapes.value.length - 1]);
  additionalShapes.value.pop();
}
