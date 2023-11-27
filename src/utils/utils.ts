import { storeToRefs } from 'pinia';
import { useCanvasStore, useUserStore } from '@/store';
const canvasStore = useCanvasStore();
const UserStore = useUserStore();
const { canvas, canvas_json } = storeToRefs(canvasStore);
const { mainSocket } = storeToRefs(UserStore);
import { fabric } from 'fabric';

export function sendToBackend(evt: fabric.IEvent): void {
  if (!canvas.value) return;
  canvas_json.value = JSON.stringify(canvas.value.toDatalessJSON());
  console.log(canvas_json.value);
  mainSocket.value.send(canvas_json.value);
}
