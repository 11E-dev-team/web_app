import { storeToRefs } from 'pinia';
import { useCanvasStore, useCanvasStateStore } from '@/store';
const canvasStore = useCanvasStore();
const canvasStateStore = useCanvasStateStore();
const { canvas, currentShape } = storeToRefs(canvasStore);
const { isDrawing } = storeToRefs(canvasStateStore);
import { fabric } from 'fabric';

export function startLine(evt: fabric.IEvent): void {
  if (!canvas.value || !evt.pointer) return;
  
  const { x, y } = evt.pointer;
  isDrawing.value = true;
  
  const points = [x, y, x, y]; // Start and end points of the line
  currentShape.value = new fabric.Line(points, {
    stroke: 'black',
    strokeWidth: 1,
  });
  
  canvas.value.add(currentShape.value);
  canvas.value.renderAll();
}

export function line(evt: fabric.IEvent): void {
  if (
    !canvas.value
    || !isDrawing.value
    || !(currentShape.value instanceof fabric.Line)
    || !evt.pointer
  ) return;

  const { x, y } = evt.pointer;
  currentShape.value.set({ x2: x, y2: y });

  canvas.value.renderAll();
}

export function endLine(evt: fabric.IEvent): void {
  isDrawing.value = false;
}
