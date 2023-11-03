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
    <!-- TODO: Fix focus and maake invisible -->
    <div>
      <input type="text" ref="textInput" @input="updateText" />
    </div>    
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
      <v-rect
        v-for="(rectangle, index) in rectangles"
        :key="index"
        :x="rectangle.x"
        :y="rectangle.y"
        :width="rectangle.width"
        :height="rectangle.height"
        :stroke="rectangle.stroke ? rectangle.stroke : 'black'"
        :strokeWidth="rectangle.strokeWidth ? rectangle.strokeWidth : 1"
        @pointerdown="handleStart"
        @pointermove="handleMove"
        @pointerup="handleEnd"
      />
      <v-ellipse
        v-for="(ellipse, index) in ellipses"
        :key="index"
        :x="ellipse.x"
        :y="ellipse.y"
        :radiusX="ellipse.radius.x"
        :radiusY="ellipse.radius.y"
        :stroke="ellipse.stroke ? ellipse.stroke : 'black'"
        :strokeWidth="ellipse.strokeWidth ? ellipse.strokeWidth : 1"
        @pointerdown="handleStart"
        @pointermove="handleMove"
        @pointerup="handleEnd"
      />
      <v-arrow
        v-for="
          (arrow, index) in [
            ...arrows, {points: [], color: 'black', width: 0, name: 'crutch'}
          ]
        "
        :key="index"
        :points="arrow.points"
        :fill="arrow.color"
        :stroke="arrow.color"
        :strokeWidth="arrow.width"
        :pointerLength="8"
        :pointerWidth="6"
        @pointerdown="handleStart"
        @pointermove="handleMove"
        @pointerup="handleEnd"
      />
      <v-text
        v-for="(text, index) in texts"
        :key="index"
        :x="text.x"
        :y="text.y"
        :text="text.text"
      />
      <!-- pointer (for center of shape) -->
      <v-circle
        :x="pointer.x"
        :y="pointer.y"
        :radius="pointer.radius"
        :fill="pointer.fill ? pointer.fill : 'grey'"
        :stroke="pointer.stroke ? pointer.stroke : 'grey'"
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
const { lines, currentLine, rectangles, ellipses, arrows, texts } = storeToRefs(canvasStore);
const canvasStateStore = useCanvasStateStore();
const { selectedShape, pointer, textInput } = storeToRefs(canvasStateStore);
import Konva from 'konva';

import { startDraw, draw, endDraw } from '@/utils/canvasLogic/pen';
import { startErase, erase, endErase } from '@/utils/canvasLogic/eraser';
import { startShape, shape, endShape } from '@/utils/canvasLogic/shapes';
import { startText, updateText } from '@/utils/canvasLogic/text';

export default {
  name: 'CanvasComponent',
  setup() {
    const stageConfig = reactive({
      width: window.innerWidth,
      height: window.innerHeight - 101,
    });

    enum tools{
      Cursor = 'Cursor',
      Pen = 'Pen',
      Eraser = 'Eraser',
      Shapes = 'Shapes',
      Text = 'Text',
    };

    const Tools: Readonly<typeof tools> = Object.freeze(tools); // Needs to be moved to stateStore?

    const selectedTool: Ref<tools> = ref<tools>(Tools.Cursor);

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
        case Tools.Text:
          startText(evt);
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

    onMounted(() => {
      window.addEventListener('resize', () => {
        stageConfig.width = window.innerWidth;
        stageConfig.height = window.innerHeight - 101;
      });
    });

    return {
      stageConfig,
      selectedShape,
      Shapes,
      selectedTool,
      Tools,
      undo,
      lines,
      currentLine,
      rectangles,
      ellipses,
      arrows,
      texts,
      handleStart,
      handleMove,
      updateText,
      handleEnd,
      pointer,
      textInput,
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
  border: 1px solid #000;
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
</style>
