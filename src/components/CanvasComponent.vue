<template>
  <div class="canvas">
    <div class="header">
      <!-- Header content -->
    </div>
    <div class="toolbar">
      <select v-model="selectedTool">
        <option v-for="tool in tools" :key="tool.value" :value="tool.value">{{ tool.label }}</option>
      </select>
      <button @click="undo">Undo</button>
      <select v-model="selectedForm">
        <option v-for="form in forms" :key="form.value" :value="form.value">{{ form.label }}</option>
      </select>
    </div>
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { Ref } from 'vue';
import paper, { Path, Rectangle } from 'paper';

export default {
  name: 'CanvasComponent',
  setup() {
    const canvasRef: Ref<HTMLCanvasElement | null> = ref<HTMLCanvasElement | null>(null);
    const tool: Ref<paper.Tool | null> = ref<paper.Tool | null>(null);
    const pathHistory: Ref<paper.Path[]> = ref<paper.Path[]>([]);
    const selectedForm: Ref<string> = ref<string>('rectangle');
    const selectedTool: Ref<string> = ref<string>('pen');
    const text: Ref<string> = ref<string>('');
    const startPoint: paper.Point | null = null;

    interface Enum {
      label: string,
      value: string,
    }
    
    const forms: Enum[] = reactive([
      { label: 'Rectangle', value: 'rectangle' },
      { label: 'Ellipse', value: 'ellipse' },
      { label: 'Arrow', value: 'arrow' },
      // Add more forms here as needed
    ]);
    const tools: Enum[] = reactive([
      { label: 'Pen', value: 'pen' },
      { label: 'Eraser', value: 'eraser' },
      { label: 'Forms', value: 'forms' },
    ]);

    function handleClick(event: paper.ToolEvent) {
      switch (selectedTool.value) {
        case 'pen':
          startDrawingLine(event);
          break;
        case 'eraser':
          erase(event);
          break;
      }
    }

    function startDrawingLine(event: paper.ToolEvent) {
      const path: paper.Path = new paper.Path();
      path.strokeColor = new paper.Color('black');
      path.add(event.point);
    }

    function startDrawingForm(event: paper.ToolEvent) {
      const startPoint = event.point;
    }

    function draw(event: paper.ToolEvent) {
      switch (selectedTool.value) {
        case 'pen':
          drawLine(event);
          break;
        case 'eraser':
          erase(event);
          break;
        case 'forms':
          setForm(event);
          break;
      }
    }

    function drawLine(event: paper.ToolEvent) {
      const path: paper.Path = paper.project.activeLayer.lastChild as paper.Path;
      path.add(event.point);
    }

    function erase(event: paper.ToolEvent) {
      // FIXME: is erasing only under
      const hitResult = paper.project.hitTest(event.point);
      if (hitResult && hitResult.item) {
        const item = hitResult.item;
        if (item instanceof paper.Path) {
          item.remove();
        }
      }
    }

    function endDrawing() {
      const path = paper.project.activeLayer.lastChild as paper.Path;
      if (path) {
        path.simplify();
        pathHistory.value.push(path);
      }
    }

    function undo() {
      const lastPath = pathHistory.value.pop();
      if (lastPath) {
        lastPath.remove();
      }
    }

    function setForm(event: paper.ToolEvent) {
      // FIXME: isn't working
      switch (selectedForm.value) {
        case 'rectangle':
          createRectangle(event);
          break;
        case 'ellpse':
        createEllipse(event);
          break;
        case 'arrow':
          createArrow(event);
          break;
        // Add more form cases here
      }
    }

    function createRectangle(event: paper.ToolEvent) {
      if (startPoint) {
        const rectangle = new Rectangle({
          point: startPoint,
          size: [event.point.x - startPoint.x, event.point.y - startPoint.y],
          fillColor: new paper.Color('black'),
        });
        const path = new paper.Path.Rectangle(rectangle);
        path.strokeColor = new paper.Color('black');
      };
    }

    function createEllipse(event: paper.ToolEvent) {
      if (startPoint) {
        const ellipse = new Path.Ellipse({
          point: startPoint,
          size: [event.point.x - startPoint.x, event.point.y - startPoint.y],
          fillColor: new paper.Color('black'),
        });

        const path = new paper.Path.Ellipse(ellipse);
        path.strokeColor = new paper.Color('black');
      }
    }

    function createArrow(event: paper.ToolEvent) {
      // const startPoint = new paper.Point(50, 50); // Replace with your desired start point
      // const endPoint = new paper.Point(150, 150); // Replace with your desired end point
      // const arrowSize = 10; // Adjust the size of the arrowhead
    
      // const line = new paper.Path.Line(startPoint, endPoint);
      // line.strokeColor = new paper.Color('black');
    
      // const arrowVector = endPoint.subtract(startPoint).normalize(1).multiply(arrowSize);
      // const arrowHead = new paper.Path([
      //   endPoint,
      //   endPoint.subtract(arrowVector.rotate(45)),
      //   endPoint,
      //   endPoint.subtract(arrowVector.rotate(-45))
      // ]);
      // arrowHead.fillColor = new paper.Color('black');
      // arrowHead.closed = true;
    }
    
    onMounted(() => {
      const canvas: HTMLCanvasElement | null = canvasRef.value;
      if (!canvas) return;
      paper.setup(canvas);
    
      tool.value = new paper.Tool();
    
      tool.value.onMouseDown = handleClick;
      tool.value.onMouseDrag = draw;
      tool.value.onMouseUp = endDrawing;

      const freehandTool = new paper.Tool();
      freehandTool.onMouseDown = handleClick;
      freehandTool.onMouseDrag = draw;
      freehandTool.onMouseUp = endDrawing;
      tool.value = freehandTool;
    });
    
    return {
      canvasRef,
      selectedForm,
      forms,
      selectedTool,
      tools,
      text,
      undo,
      setForm,
    };
  },
};
</script>

<style scoped>
.canvas {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.header {
  height: 60px;
  /* Additional header styles */
}

canvas {
  border: 1px solid #000;
  width: 100%;
  height: 100%;
}

.text-tool {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.text-tool input {
  margin-right: 10px;
}
</style>
