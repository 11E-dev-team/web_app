<template>
  <ToolKit />
  <div class="container">
    <canvas id="canvas" ref="canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, watch, onBeforeUnmount, computed, defineComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { useCanvasStore, useCanvasStateStore } from '@/store';
const canvasStore = useCanvasStore();
const { canvas, canvas_json, currentShape } = storeToRefs(canvasStore);
const canvasStateStore = useCanvasStateStore();
const { selectedTool } = storeToRefs(canvasStateStore);
import { useUserStore } from '@/store';
const userStore = useUserStore();
const { socket } = storeToRefs(userStore);
import { fabric } from 'fabric';

import { Tools } from '@/store/public_interfaces';

import { startShape, shape, endShape } from '@/utils/canvasLogic/shapes';
import { startText } from '@/utils/canvasLogic/text';
import { sendToBackend } from '@/utils/utils';

import ToolKit from './ToolKitComponent.vue';

socket.value.onopen = function () {
  console.log('Connection established');
};

export default defineComponent({
  name: 'CanvasComponent',
  components: {
    ToolKit,
  },
  setup() {
    const stageConfig = reactive({
      width: window.innerWidth,
      height: window.innerHeight - 105,
    });

    const isSelectionMode = computed(() => selectedTool.value === Tools.Cursor);
    const isDrawingMode = computed(() => selectedTool.value === Tools.Pen || selectedTool.value === Tools.Eraser);
    const freeDrawingBrushInverted = computed(() => selectedTool.value === Tools.Eraser);

    // Handle click event based on selected tool
    function handleStart(evt: fabric.IEvent): void {
      switch (selectedTool.value) {
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
        case Tools.Shapes:
          shape(evt);
          break;
      }
    }

    function handleEnd(evt: fabric.IEvent): void {
      switch (selectedTool.value) {
        case Tools.Pen || Tools.Cursor:
          sendToBackend(evt);
          break; 
        case Tools.Shapes:
          endShape(evt);
          sendToBackend(evt);
          break;
      }
    }

    function deleteSelected(): void {
      if (!canvas.value) return;
      const activeObject = canvas.value.getActiveObject();
      if (!activeObject) return;
      canvas.value.remove(activeObject);
    }

    function handleKeyDown(evt: KeyboardEvent): void {
      switch (evt.key) {
        case 'Backspace' || 'Delete':
          deleteSelected();
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

      if (!(canvas.value instanceof fabric.Canvas)) {
        canvas.value = new fabric.Canvas('canvas', {
          width: stageConfig.width,
          height: stageConfig.height,
        });
        if (canvas_json.value) {
          canvas.value.loadFromJSON(canvas_json.value, canvas.value.renderAll.bind(canvas.value));
        }
      };
      canvas.value.on('mouse:move', handleMove);
      canvas.value.on('mouse:down', handleStart);
      canvas.value.on('mouse:up', handleEnd);

      // canvas.value.on('after:render', sendToBackend);

      socket.value.onmessage = function (evt) {
        if (!canvas.value) return;
        console.log(evt.data);
        canvas_json.value = evt.data;
        canvas.value.loadFromJSON(canvas_json.value, canvas.value.renderAll.bind(canvas.value));
      };

      canvas.value.selection = isSelectionMode.value;
      // canvas.value.freeDrawingBrush = new fabric.EraserBrush(canvas);
      canvas.value.isDrawingMode = isDrawingMode.value;
      // canvas.value.freeDrawingBrush = freeDrawingBrushInverted.value;

      watch(isDrawingMode, (newValue) => {
        if (canvas.value instanceof fabric.Canvas) {
          canvas.value.isDrawingMode = newValue;
        }
      })
      watch(isSelectionMode, (newValue) => {
        if (canvas.value instanceof fabric.Canvas) {
          canvas.value.selection = newValue;
        }
      })
    });

    onBeforeUnmount(() => {
      if (canvas.value instanceof fabric.Canvas) {
        canvas.value.off('mouse:move', handleMove);
        canvas.value.off('mouse:down', handleStart);
        canvas.value.off('mouse:up', handleEnd);

        canvas_json.value = JSON.stringify(canvas.value.toDatalessJSON());

        canvas.value.dispose();
        canvas.value = undefined;
      }
    });

    return;
  },
});
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
