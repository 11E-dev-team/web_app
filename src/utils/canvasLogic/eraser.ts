import { storeToRefs } from 'pinia';
import { useCanvasStore, useCanvasStateStore } from '@/store';
const canvasStore = useCanvasStore();
const canvasStateStore = useCanvasStateStore();
const { lines, rectangles, ellipses, arrows, texts } = storeToRefs(canvasStore);
const { isErasing } = storeToRefs(canvasStateStore);
import { fabric } from 'fabric';

function deleteShape(id: string): void {
  const lineIndex = lines.value.findIndex((line) => line.id === id);
  if (lineIndex !== -1) {
    lines.value.splice(lineIndex, 1);
    return;
  }

  const rectIndex = rectangles.value.findIndex((rect) => rect.id === id);
  if (rectIndex !== -1) {
    rectangles.value.splice(rectIndex, 1);
    return;
  }

  const ellipseIndex = ellipses.value.findIndex((ellipse) => ellipse.id === id);
  if (ellipseIndex !== -1) {
    ellipses.value.splice(ellipseIndex, 1);
    return;
  }

  const arrowIndex = arrows.value.findIndex((arrow) => arrow.id === id);
  if (arrowIndex !== -1) {
    arrows.value.splice(arrowIndex, 1);
    return;
  }

  const textIndex = texts.value.findIndex((text) => text.id === id);
  if (textIndex !== -1) {
    texts.value.splice(textIndex, 1);
    return;
  }
}

export function startErase(evt: fabric.IEvent): void {
  isErasing.value = true;
  // if (evt.target._id === 1) return;
}

export function erase(evt: fabric.IEvent): void {
  if (!isErasing.value) return;
  // if (evt.target._id === 1) return;
}

export function endErase(evt: fabric.IEvent): void {
  isErasing.value = false;
  // if (evt.target._id === 1) return;
  // evt.target.destroy();
}
