import { storeToRefs } from 'pinia';
import { useCanvasStore, useCanvasStateStore } from '@/store';
import { Line, Rectangle, Ellipse, Arrow, Text } from '@/store/public_interfaces';
const canvasStore = useCanvasStore();
const canvasStateStore = useCanvasStateStore();
const { lines, rectangles, ellipses, arrows, texts, transformer } = storeToRefs(canvasStore);
const { shapeIdToTransform } = storeToRefs(canvasStateStore);
import Konva from 'konva';

export function startCursor(evt: Konva.KonvaEventObject<MouseEvent>): void {
  if (!transformer.value) return;

  const id = evt.target.id();
  const shape: (
    Line | Rectangle | Ellipse | Arrow | Text | undefined
  ) = [
    ...lines.value,
    ...rectangles.value,
    ...ellipses.value,
    ...arrows.value,
    ...texts.value
  ].find((s) => s.id === id);

  if (shape) {
    shapeIdToTransform.value = id;
    // TODO: end cursor logic
    // const htmlShape = evt.target;
    // transformer.value.nodes([htmlShape]);
  } else {
    shapeIdToTransform.value = null;
  }
}

export function moveCursor(evt: Konva.KonvaEventObject<MouseEvent>): void {}

export function endCursor(evt: Konva.KonvaEventObject<MouseEvent>): void {}
