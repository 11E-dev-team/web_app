import { storeToRefs } from "pinia";
import { useCanvasStore } from '@/store';
const canvasStore = useCanvasStore();
const { canvas } = storeToRefs(canvasStore);

export function deleteSelected(): void {
  if (!canvas.value) return;
  const activeObjects = canvas.value.getActiveObjects();
  if (!activeObjects) return;
  for (const activeObject of activeObjects) {
    canvas.value.remove(activeObject);
  }
}
