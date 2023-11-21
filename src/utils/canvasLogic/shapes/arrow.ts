import { storeToRefs } from 'pinia';
import { useCanvasStore, useCanvasStateStore } from '@/store';
const canvasStore = useCanvasStore();
const canvasStateStore = useCanvasStateStore();
const { canvas, currentShape, additionalShapes } = storeToRefs(canvasStore);
const { isDrawing, selectedColor } = storeToRefs(canvasStateStore);
import { fabric } from 'fabric';

export function startArrow(evt: fabric.IEvent): void {
  if (!canvas.value || !evt.pointer) return;
  
  const { x, y } = evt.pointer;
  isDrawing.value = true;
  
  const points = [x, y, x, y];
  currentShape.value = new fabric.Line(points, {
    stroke: selectedColor.value,
    strokeWidth: 1,
  });

  additionalShapes.value.push(new fabric.Triangle({
    left: x,
    top: y,
    width: 10,
    height: 10,
    fill: selectedColor.value,
    stroke: selectedColor.value,
    strokeWidth: 1,
  }));

  canvas.value.add(currentShape.value);
  canvas.value.add(additionalShapes.value[additionalShapes.value.length - 1]);
  canvas.value.renderAll();
}

export function arrow(evt: fabric.IEvent): void {
  if (
    !canvas.value
    || !isDrawing.value
    || !(currentShape.value instanceof fabric.Line)
    || !evt.pointer
  ) return;

  const { x, y } = evt.pointer;
  currentShape.value.set({ x2: x, y2: y });
  const xDiff = x - (currentShape.value.x1 ? currentShape.value.x1 : 0);
  const yDiff = y - (currentShape.value.y1 ? currentShape.value.y1 : 0);
  const angle = Math.atan2(yDiff, xDiff);
  additionalShapes.value[additionalShapes.value.length - 1].set({
    left: x + 10 * Math.sin(angle)/2,
    top: y - 10 * Math.cos(angle)/2,
    angle: (angle * 180 / Math.PI) + 90,
  });

  canvas.value.renderAll();
}

export function endArrow(evt: fabric.IEvent): void {
  isDrawing.value = false;
  additionalShapes.value.pop();
}
