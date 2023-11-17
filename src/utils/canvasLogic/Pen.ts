import { storeToRefs } from 'pinia';
import { useCanvasStore, useCanvasStateStore } from '@/store';
const canvasStore = useCanvasStore();
const canvasStateStore = useCanvasStateStore();
const { currentId, lines, currentLine } = storeToRefs(canvasStore);
const { isDrawing } = storeToRefs(canvasStateStore);
import { fabric } from 'fabric';

export function startDraw(evt: fabric.IEvent): void {
  console.log(evt);
  isDrawing.value = true;
  if (!evt.pointer) return;
  const { x, y } = evt.pointer;
  currentLine.value.points.push(x, y);
  lines.value.push({ ...currentLine.value });
}

export function draw(evt: fabric.IEvent): void {
  if (!isDrawing.value) return;
  if (!evt.pointer) return;
  const { x, y } = evt.pointer;
  currentLine.value.points.push(x, y);
  lines.value.push({ ...currentLine.value });
}

export function endDraw(evt: fabric.IEvent): void {
  isDrawing.value = false;
  for (var i: number = 0; i < currentLine.value.points.length; i += 2) {
    lines.value.pop();
  }
  lines.value.push({ ...currentLine.value });
  currentId.value += 1;
  currentLine.value.id = currentId.value.toString();
  currentLine.value.color = 'black';
  currentLine.value.width = 1;
  currentLine.value.points = [];
}
