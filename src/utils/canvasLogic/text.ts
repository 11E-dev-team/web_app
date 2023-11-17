import { storeToRefs } from 'pinia';
import { useCanvasStore, useCanvasStateStore } from '@/store';
const canvasStore = useCanvasStore();
const canvasStateStore = useCanvasStateStore();
const { currentId, texts, currentText } = storeToRefs(canvasStore);
const { isTexting } = storeToRefs(canvasStateStore);
import { fabric } from 'fabric';

export function startText(evt: fabric.IEvent): void {
  if (!evt.pointer) return;
  const { x, y } = evt.pointer;
  if (isTexting.value) endText();
  currentId.value += 1;
  currentText.value = {
    id: currentId.value.toString(),
    x: x,
    y: y,
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
  currentId.value += 1;
  currentText.value = {
    id: currentId.value.toString(),
    x: 0,
    y: 0,
    text: '',
  };
}
