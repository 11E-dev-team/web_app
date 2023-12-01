import { storeToRefs } from 'pinia';

import { useCanvasStore } from '@/store';
import Conference from './canvasLogic/Conference';

const canvasStore = useCanvasStore();
const { canvas, canvas_json } = storeToRefs(canvasStore);

export function sendToBackend(Conference: Conference): void {
  if (!canvas.value) return;
  canvas_json.value = JSON.stringify(canvas.value.toDatalessJSON());
  console.log(canvas_json.value);
  Conference.send(canvas_json.value);
}
