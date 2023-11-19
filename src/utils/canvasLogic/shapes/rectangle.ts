import { storeToRefs } from 'pinia';
import { useCanvasStore, useCanvasStateStore } from '@/store';
const canvasStore = useCanvasStore();
const canvasStateStore = useCanvasStateStore();
const { canvas, currentShape } = storeToRefs(canvasStore);
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
  canvas.value.add(currentShape.value);
  canvas.value.renderAll();
}

export function rectangle(evt: fabric.IEvent): void {
  if (!evt.pointer) return;
  const { x, y } = evt.pointer;
  if (!isDrawing.value) return;
  if (!(currentShape.value instanceof fabric.Rect)) return;
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

export function endRectangle(evt: fabric.IEvent): void {
  isDrawing.value = false;
}
