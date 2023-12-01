import { storeToRefs } from 'pinia';
import { useCanvasStore, useCanvasStateStore } from '@/store';
const canvasStore = useCanvasStore();
const canvasStateStore = useCanvasStateStore();
const { canvas, currentShape } = storeToRefs(canvasStore);
const { selectedColor } = storeToRefs(canvasStateStore);
import { fabric } from 'fabric';

export function startText(evt: fabric.IEvent): void {
  if (!evt.pointer) return;
  const { x, y } = evt.pointer;
  if (!canvas.value) return;
  currentShape.value = new fabric.IText('', {
    left: x,
    top: y,
    fontSize: 20,
    fontFamily: 'Arial',
    fill: selectedColor.value,
  })
  canvas.value.add(currentShape.value)
  canvas.value.setActiveObject(currentShape.value);
  currentShape.value.enterEditing();
}
