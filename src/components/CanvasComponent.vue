<template>
  <div class="toolbar">
    <select v-model="selectedTool">
      <option v-for="[key, value] in Object.entries(Tools)" :key="key" :value="key">{{ value }}</option>
    </select>
    <button @click="undo">Undo</button>
    <select v-model="selectedShape">
      <option v-for="[key, value] in Object.entries(Shapes)" :key="key" :value="key">{{ value }}</option>
    </select>
  </div>
  <v-stage
    :config="stageConfig"
    :style="{ width: '100%', height: '100%', position: 'absolute', top: '60px', left: '0px' }"
    @pointerdown="handleStart"
    @pointermove="handleMove"
    @pointerup="handleEnd"
  >
    <v-layer>
      <v-line
        v-for="(line, index) in lines"
        :key="index"
        :points="line.points"
        :stroke="line.color"
        :strokeWidth="line.width"
        @pointerdown="handleStart"
        @pointermove="handleMove"
        @pointerup="handleEnd"
      />
    </v-layer>
  </v-stage>
</template>

<script lang="ts">
import { ref, onMounted, reactive, watch } from 'vue';
import { Ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useCanvasStore } from '@/store';
const canvasStore = useCanvasStore();
const { dataURL } = storeToRefs(canvasStore);
import Konva from 'konva';

export default {
  name: 'CanvasComponent',
  setup() {
    const stageConfig = reactive({
      width: window.innerWidth,
      height: window.innerHeight - 132,
    });

    enum shapes {
      Rectangle = 'Rectangle',
      Ellipse = 'Ellipse',
      Arrow = 'Arrow',
    };

    const Shapes: Readonly<typeof shapes> = Object.freeze(shapes);

    enum tools{
      Pen = 'Pen',
      Eraser = 'Eraser',
      Shapes = 'Shapes',
    };

    const Tools: Readonly<typeof tools> = Object.freeze(tools);

    const selectedShape: Ref<shapes> = ref<shapes>(Shapes.Rectangle);
    const selectedTool: Ref<tools> = ref<tools>(Tools.Pen);

    interface Line {
      points: number[];
      color: string;
      width: number;
    }
    const currentLine: Line = reactive({
      points: [],
      color: 'black',
      width: 2,
    })
    const lines: Line[] = reactive([])
    const text: Ref<string> = ref<string>('');

    const isDrawing: Ref<boolean> = ref<boolean>(false);
    const isErasing: Ref<boolean> = ref<boolean>(false)

    // Handle click event based on selected tool
    function handleStart(evt: Konva.KonvaEventObject<MouseEvent>) {
      switch (selectedTool.value) {
        case Tools.Pen:
          startDraw(evt);
          break;
        case Tools.Eraser:
          startErase(evt);
          break;
        case Tools.Shapes:
          startShape(evt);
          break;
      }
    }

    // TODO: Move functions of business logic to separated file
    function startDraw(evt: Konva.KonvaEventObject<MouseEvent>) {
      isDrawing.value = true;
      const { offsetX, offsetY } = evt.evt;
      currentLine.points.push(offsetX, offsetY);
    }

    function startErase(evt: Konva.KonvaEventObject<MouseEvent>) {
      isErasing.value = true;
      if (!evt.target.parent) return;
      evt.target.destroy();
    }

    function startShape(evt: Konva.KonvaEventObject<MouseEvent>) {
      // Start setting the form
    }

    // Handle move event based on selected tool
    function handleMove(evt: Konva.KonvaEventObject<MouseEvent>) {
      switch (selectedTool.value) {
        case Tools.Pen:
          draw(evt);
          break;
        case Tools.Eraser:
          erase(evt);
          break;
        case Tools.Shapes:
          shape(evt);
          break;
      }
    }

    function draw(evt: Konva.KonvaEventObject<MouseEvent>) {
      if (!isDrawing.value) return;
      const { offsetX, offsetY } = evt.evt;
      currentLine.points.push(offsetX, offsetY);
      lines.push({ ...currentLine });
    }

    function erase(evt: Konva.KonvaEventObject<MouseEvent>) {
      if (!isErasing.value) return;
      if (!evt.target.parent) return;
      evt.target.destroy();
    }

    function shape(evt: Konva.KonvaEventObject<MouseEvent>) {
      // Handle shape event based on selected tool
    }

    function handleEnd(evt: Konva.KonvaEventObject<MouseEvent>) {
      switch (selectedTool.value) {
        case Tools.Pen:
          endDraw(evt);
          break;
        case Tools.Eraser:
          endErase(evt);
          break;
        case Tools.Shapes:
          endShape(evt);
          break;
      }
    }

    function endDraw(evt: Konva.KonvaEventObject<MouseEvent>) {
      isDrawing.value = false;
      currentLine.points = [];
    }

    function endErase(evt: Konva.KonvaEventObject<MouseEvent>) {
      isErasing.value = false;
      if (!evt.target.parent) return;
      evt.target.destroy();
    }

    function endShape(evt: Konva.KonvaEventObject<MouseEvent>) {
      // End setting the form
    }

    // Handle undo
    function undo() {
      // Undo the last action
    }

    return {
      stageConfig,
      selectedShape,
      Shapes,
      selectedTool,
      Tools,
      text,
      undo,
      lines,
      handleStart,
      handleMove,
      handleEnd,
    };
  },
};
</script>

<style scoped>
.canvas {
  display: flex;
  flex-direction: column;
}

canvas {
  border: 1px solid #000;
  width: 100%;
  height: 100%;
}
</style>
