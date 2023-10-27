<template>
  <div class="canvas">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import paper, { Path, PointText, Rectangle } from 'paper';

export default {
  name: 'CanvasComponent',
  setup() {
    const canvasRef = ref<HTMLCanvasElement | null>(null);
    let tool: paper.Tool;
    let textToolPosition: { x: number; y: number } = { x: 0, y: 0 };
    let isTextToolActive: boolean = false;
    let text: string = '';

    function handleCanvasClick(event: MouseEvent) {
      const { offsetX, offsetY } = getCoordinates(event);

      textToolPosition = {
        x: offsetX,
        y: offsetY
      };
    }

    function startDrawing(event: paper.ToolEvent) {
      const path: paper.Path = new paper.Path();
      path.strokeColor = new paper.Color('black');
      path.add(event.point);
    }

    function draw(event: paper.ToolEvent) {
      const path: paper.Path = paper.project.activeLayer.lastChild as paper.Path;
      path.add(event.point);
    }

    function endDrawing(event: paper.ToolEvent) {
      const path: paper.Path = paper.project.activeLayer.lastChild as paper.Path;
      path.simplify();
    }

    function getCoordinates(event: MouseEvent) {
      const canvas: HTMLCanvasElement | null = canvasRef.value;
      if (!canvas) return { offsetX: 0, offsetY: 0 };
      const rect: DOMRect = canvas.getBoundingClientRect();
      const offsetX: number = event.clientX - rect.left;
      const offsetY: number = event.clientY - rect.top;

      return { offsetX, offsetY };
    }

    function addTextToCanvas() {
      const textItem: paper.PointText = new PointText({
        point: new paper.Point(textToolPosition.x, textToolPosition.y),
        content: text,
        fillColor: new paper.Color('black'), // Use a Color object instead of a string
        fontWeight: 'bold',
        fontSize: 16
      });
      textItem.justification = 'center';
      textItem.position.x += textItem.bounds.width / 2;
    }

    onMounted(() => {
      const canvas: HTMLCanvasElement | null = canvasRef.value;
      if (!canvas) return;
      paper.setup(canvas);

      tool = new paper.Tool();

      tool.onMouseDown = startDrawing;
      tool.onMouseDrag = draw;
      tool.onMouseUp = endDrawing;
      canvas.addEventListener('click', handleCanvasClick);
    });

    return {
      canvasRef,
      textToolPosition,
      isTextToolActive,
      text,
      handleCanvasClick,
      startDrawing,
      draw,
      endDrawing,
      addTextToCanvas
    };
  },
};
</script>

<style scoped>
.canvas {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 120px);
}

canvas {
  border: 1px solid #000;
  width: 100%;
  height: 100%;
}
</style>