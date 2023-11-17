<template>
  <div class="toolkit">
    <!-- TODO: add icons -->
    <button @click="selectedTool = Tools.Cursor">Cursor</button>
    <button @click="selectedTool = Tools.Text">Text</button>
    <button @click="selectedTool = Tools.Shapes">Shapes</button>
    <button @click="selectedTool = Tools.Pen">Pen</button>
    <button @click="selectedTool = Tools.Eraser">Eraser</button>
    <button @click="undo">Undo</button>
    <!-- TODO: Move to Shapes chooser -->
    <div>
      <select v-model="selectedShape">
        <option v-for="[key, value] in Object.entries(Shapes)" :key="key" :value="key">{{ value }}</option>
      </select>
    </div>
  </div>
  <div class="container">
    <canvas id="canvas" ref="canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, reactive, watch, onBeforeUnmount, computed } from 'vue';
import { Ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useCanvasStore, Shapes, useCanvasStateStore } from '@/store';
const canvasStore = useCanvasStore();
const { canvas, canvas_json, lines, currentLine, rectangles, ellipses, arrows, texts, currentText } = storeToRefs(canvasStore);
const canvasStateStore = useCanvasStateStore();
const { selectedTool, selectedShape, pointer } = storeToRefs(canvasStateStore);
import { fabric } from 'fabric';

import { Tools, Tools_ } from '@/store/public_interfaces';

import { startDraw, draw, endDraw } from '@/utils/canvasLogic/pen';
import { startErase, erase, endErase } from '@/utils/canvasLogic/eraser';
import { startShape, shape, endShape } from '@/utils/canvasLogic/shapes';
import { startText, updateText } from '@/utils/canvasLogic/text';

export default {
  name: 'CanvasComponent',
  setup() {
    const stageConfig = reactive({
      width: window.innerWidth,
      height: window.innerHeight - 105,
    });

    const isDrawingMode = computed(() => selectedTool.value === Tools.Pen || selectedTool.value === Tools.Eraser);
    const freeDrawingBrushInverted = computed(() => selectedTool.value === Tools.Eraser);

    // Handle click event based on selected tool
    function handleStart(evt: fabric.IEvent): void {
      console.log("handler");
      console.log(evt);
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
        case Tools.Text:
          startText(evt);
          break;
      }
    }

    // Handle move event based on selected tool
    function handleMove(evt: fabric.IEvent): void {
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

    function handleEnd(evt: fabric.IEvent): void {
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

    onMounted(() => {
      window.addEventListener('resize', () => {
        stageConfig.width = window.innerWidth;
        stageConfig.height = window.innerHeight - 101;
        if (canvas.value instanceof fabric.Canvas) {
          canvas.value.setDimensions({ width: stageConfig.width, height: stageConfig.height });
        };
      });

      // window.addEventListener('keydown', (evt: KeyboardEvent) => {
      //   updateText(evt);
      // });

      if (typeof canvas.value !== 'undefined') {
        if (!(canvas.value instanceof fabric.Canvas)) {
          canvas.value = new fabric.Canvas('canvas', {
            width: stageConfig.width,
            height: stageConfig.height,
          });
          if (canvas_json.value) {
            canvas.value.loadFromJSON(canvas_json.value, canvas.value.renderAll.bind(canvas.value));
          }
        };

        // canvas.on('after:render', () =>{ if (!canvas) return; canvas.calcOffset(); });
        // canvas.value.on('mouse:move', handleMove);
        // canvas.value.on('mouse:down', handleStart);
        // canvas.value.on('mouse:up', handleEnd);
        // canvas.value.freeDrawingBrush = new fabric.EraserBrush(canvas);
        canvas.value.isDrawingMode = isDrawingMode.value;
        // canvas.value.freeDrawingBrush = freeDrawingBrushInverted.value;
      };

      watch(isDrawingMode, (newValue) => {
        if (canvas.value instanceof fabric.Canvas) {
          canvas.value.isDrawingMode = newValue;
        }
      })
    });

    onBeforeUnmount(() => {
      // canvas.value.off('mouse:move', handleMove);
      // canvas.value.off('mouse:down', handleStart);
      // canvas.value.off('mouse:up', handleEnd);

      if (canvas.value instanceof fabric.Canvas) {
        canvas_json.value = JSON.stringify(canvas.value.toDatalessJSON());
      }
    });

    return {
      stageConfig,
      selectedShape,
      Shapes,
      selectedTool,
      Tools,
      undo,
      canvas,
    };
  },
};
</script>

<style scoped lang="scss">
@import '@/assets/scss/main.scss';
.canvas {
  display: flex;
  flex-direction: column;
}

canvas {
  width: 100%;
  height: 100%;
}

.toolkit {
  position: relative;
  z-index: 100;
  left: 32px;
  top: 32px;

  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 16px;

  width: 80px;

  button {
    width: 48px;
    height: 48px;

    background-color: var(--accent, #464ab4);
  }
}

.container {
  position: absolute !important;
  top: 101px;
  left: 0;
  width: 100%;
  height: calc(100% - 101px);
}

#textInput {
  position: absolute;
  top: 101px;
  left: 0;
  width: 100vw;
  height: calc(100vh - 101px);
  border: none;
}
</style>
