import { storeToRefs } from 'pinia';
import { useCanvasStore, useCanvasStateStore } from '@/store';
const canvasStore = useCanvasStore();
const canvasStateStore = useCanvasStateStore();
const { texts, currentText } = storeToRefs(canvasStore);
const { isTexting } = storeToRefs(canvasStateStore);
import Konva from 'konva';

export function startText(evt: Konva.KonvaEventObject<MouseEvent>): void {
  currentText.value = {
    x: evt.evt.offsetX,
    y: evt.evt.offsetY,
    text: '',
  };
  isTexting.value = true;
  texts.value.push({ ...currentText.value });
}

export function updateText(evt: KeyboardEvent): void {
  if (!isTexting.value) return;
  switch (evt.key) {
    case 'Enter' || 'Escape':
      endText();
      return;
    case 'Backspace':
      currentText.value.text = currentText.value.text.slice(0, -1);
      return;
    default:
      if (evt.key.length > 1) return;
  };
  currentText.value.text += evt.key;
}

function endText(): void {
  if (!isTexting.value) return;
  isTexting.value = false;
  texts.value.pop();
  texts.value.push({ ...currentText.value });
  currentText.value = {
    x: 0,
    y: 0,
    text: '',
  };
}
