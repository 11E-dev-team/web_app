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
import { useCanvasStore, Shapes, useCanvasStateStore } from '@/store';
const canvasStore = useCanvasStore();
const { lines, currentLine } = storeToRefs(canvasStore);
const canvasStateStore = useCanvasStateStore();
const { selectedShape } = storeToRefs(canvasStateStore);
import Konva from 'konva';

import { startDraw, draw, endDraw } from '@/utils/canvasLogic/pen';
import { startErase, erase, endErase } from '@/utils/canvasLogic/eraser';
import { startShape, shape, endShape } from '@/utils/canvasLogic/shapes';

export default {
  name: 'CanvasComponent',
  setup() {
    const stageConfig = reactive({
      width: window.innerWidth,
      height: window.innerHeight - 132,
    });

    enum tools{
      Pen = 'Pen',
      Eraser = 'Eraser',
      Shapes = 'Shapes',
    };

    const Tools: Readonly<typeof tools> = Object.freeze(tools); // Needs to be moved to stateStore?

    const selectedTool: Ref<tools> = ref<tools>(Tools.Pen);

    // Handle click event based on selected tool
    function handleStart(evt: Konva.KonvaEventObject<MouseEvent>): void {
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

    // Handle move event based on selected tool
    function handleMove(evt: Konva.KonvaEventObject<MouseEvent>): void {
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

    function handleEnd(evt: Konva.KonvaEventObject<MouseEvent>): void {
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

    // Handle undo
    function undo(): void {
      // TODO: Undo the last action
    }

    return {
      stageConfig,
      selectedShape,
      Shapes,
      selectedTool,
      Tools,
      undo,
      lines,
      currentLine,
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
