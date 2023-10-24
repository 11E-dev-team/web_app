<template>
  <div class="canvas">
    <div class="toolkit">
      <button @click="tool = 'freepen'">Freepen</button>
      <button @click="tool = 'eraser'">Eraser</button>
      <button @click="tool = 'rectangle'">Rectangle</button>
    </div>
    <div class="canvas-container">
      <canvas ref="canvasRef" @mousedown="startDrawing" @mousemove="draw" @mouseup="endDrawing"></canvas>
    </div>
    <div class="buttons">
      <button @click="saveCanvas">Save</button>
      <button @click="loadCanvas">Load</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useCanvasStore } from '@/store';
const canvasStore = useCanvasStore();
const { dataURL } = storeToRefs(canvasStore);

export default defineComponent({
  name: 'Canvas',
  setup() {
    const canvasRef = ref<HTMLCanvasElement | null>(null);
    const context = ref<CanvasRenderingContext2D | null>(null);
    const tool = ref('freepen');
    const isDrawing = ref(false);
    const lastX = ref(0);
    const lastY = ref(0);

    function startDrawing(event: MouseEvent | TouchEvent) {
      isDrawing.value = true;
      const { offsetX, offsetY } = getCoordinates(event);
      lastX.value = offsetX;
      lastY.value = offsetY;
    }

    function draw(event: MouseEvent | TouchEvent) {
      if (!isDrawing.value) return;
      const { offsetX, offsetY } = getCoordinates(event);
      const ctx = context.value;
      if (!ctx) return;
      ctx.strokeStyle = tool.value === 'eraser' ? 'white' : 'black';
      ctx.lineWidth = 2;

      if (tool.value === 'freepen' || tool.value === 'eraser') {
        ctx.beginPath();
        ctx.moveTo(lastX.value, lastY.value);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
        lastX.value = offsetX;
        lastY.value = offsetY;
      }
    }

    function endDrawing(event: MouseEvent | TouchEvent) {
      if (tool.value === 'rectangle') {
        if (!isDrawing.value) return;
        const { offsetX, offsetY } = getCoordinates(event);
        const ctx = context.value;
        if (!ctx) return;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.beginPath();

        // Determine the starting position of the rectangle
        const startX = Math.min(lastX.value, offsetX);
        const startY = Math.min(lastY.value, offsetY);

        // Determine the width and height of the rectangle
        const width = Math.abs(lastX.value - offsetX);
        const height = Math.abs(lastY.value - offsetY);

        // Draw the rectangle
        ctx.rect(startX, startY, width, height);
        ctx.stroke();

        lastX.value = offsetX;
        lastY.value = offsetY;
      }
      isDrawing.value = false;
    }

    function getCoordinates(event: MouseEvent | TouchEvent) {
      const canvas = canvasRef.value;
      if (!canvas) return { offsetX: 0, offsetY: 0 };
    
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
    
      const { clientX, clientY } = event instanceof MouseEvent ? event : event.touches[0];
      const offsetX = (clientX - rect.left) * scaleX;
      const offsetY = (clientY - rect.top) * scaleY;
    
      return { offsetX, offsetY };
    }

    function saveCanvas() {
      const canvas = canvasRef.value;
      if (!canvas) return;
      dataURL.value = canvas.toDataURL();
      // Save the dataURL to your preferred storage mechanism
    }

    function loadCanvas() {
      // Load the dataURL from your storage mechanism
      const canvas = canvasRef.value;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const img = new Image();
      img.onload = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = dataURL.value ? dataURL.value : '';
    }

    return {
      canvasRef,
      context,
      tool,
      isDrawing,
      startDrawing,
      draw,
      endDrawing,
      saveCanvas,
      loadCanvas
    };
  },
  mounted() {
    const canvas = this.canvasRef;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    this.context = ctx;
  },
});
</script>

<style lang="scss">
.canvas {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: calc(100vh - 120px);
}

.toolkit {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.canvas-container {
  position: relative;
  width: 100%; // Adjust the width and height as needed
  height: 100%;
  border: 1px solid black;
}

.canvas-container canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.buttons {
  display: flex;
  gap: 10px;
}
</style>
