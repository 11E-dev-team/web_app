import { storeToRefs } from 'pinia';
import { useCanvasStore, useCanvasStateStore } from '@/store';
const canvasStore = useCanvasStore();
const canvasStateStore = useCanvasStateStore();
const { lines, currentLine } = storeToRefs(canvasStore);
const { isDrawing } = storeToRefs(canvasStateStore);
import Konva from 'konva';

export function startDraw(evt: Konva.KonvaEventObject<MouseEvent>): void {
  isDrawing.value = true;
  const { offsetX, offsetY } = evt.evt;
  currentLine.value.points.push(offsetX, offsetY);
  lines.value.push({ ...currentLine.value });
}

export function draw(evt: Konva.KonvaEventObject<MouseEvent>): void {
  if (!isDrawing.value) return;
  const { offsetX, offsetY } = evt.evt;
  currentLine.value.points.push(offsetX, offsetY);
  lines.value.push({ ...currentLine.value });
}

export function endDraw(evt: Konva.KonvaEventObject<MouseEvent>): void {
  isDrawing.value = false;
  for (var i: number = 0; i < currentLine.value.points.length; i += 2) {
    lines.value.pop();
  }
  lines.value.push({ ...currentLine.value });
  currentLine.value.color = 'black';
  currentLine.value.width = 2;
  currentLine.value.points = [];
}
