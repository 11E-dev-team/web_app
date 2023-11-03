import { storeToRefs } from 'pinia';
import { useCanvasStateStore } from '@/store';
const canvasStateStore = useCanvasStateStore();
const { isErasing } = storeToRefs(canvasStateStore);
import Konva from 'konva';

function eraseAtPoint(evt: Konva.KonvaEventObject<MouseEvent>): void {
  const stage = evt.target.parent;
  const toDestroy = stage?.getAllIntersections(stage.getRelativePointerPosition());
  if (!toDestroy) return;
  for (const shape of toDestroy) {
    shape.destroy();
  }
}

export function startErase(evt: Konva.KonvaEventObject<MouseEvent>): void {
  isErasing.value = true;
  if (evt.target._id === 1) return;
  eraseAtPoint(evt);
}

export function erase(evt: Konva.KonvaEventObject<MouseEvent>): void {
  if (!isErasing.value) return;
  if (evt.target._id === 1) return;
  eraseAtPoint(evt);
}

export function endErase(evt: Konva.KonvaEventObject<MouseEvent>): void {
  isErasing.value = false;
  if (evt.target._id === 1) return;
  evt.target.destroy();
}
