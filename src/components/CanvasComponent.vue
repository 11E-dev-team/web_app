<template>
  <div class="container" ref="container">
    <canvas id="canvas" ref="canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { onMounted, reactive, watch, onBeforeUnmount, computed, defineComponent, ref, Ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useCanvasStore, useCanvasStateStore } from '@/store';
const canvasStore = useCanvasStore();
const { canvas, canvas_json, currentShape } = storeToRefs(canvasStore);
const canvasStateStore = useCanvasStateStore();
const { selectedTool, selectedColor } = storeToRefs(canvasStateStore);
import { useUserStore } from '@/store';
const userStore = useUserStore();
const { socket } = storeToRefs(userStore);
import { fabric } from 'fabric';

import { Tools } from '@/store/public_interfaces';

import { startShape, shape, endShape } from '@/utils/canvasLogic/shapes';
import { startText } from '@/utils/canvasLogic/text';
import { sendToBackend } from '@/utils/utils';

import ToolKit from './ToolKitComponent.vue';
import NavigationBar from './NavigationComponent.vue';

socket.value.onopen = function () {
  console.log('Connection established');
};

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
    case Tools.Cursor:
      sendToBackend(evt);
      break; 
    case Tools.Pen:
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

export default defineComponent({
  name: 'CanvasComponent',
  components: {
    ToolKit,
    NavigationBar,
  },
  props: {
    main: Boolean,
    isEditable: Boolean,
  },
  data() {
    const container: Ref<HTMLElement | undefined> = ref<HTMLElement | undefined>(undefined);
    const stageConfig = reactive({
      width: container.value ? container.value.offsetWidth : window.innerWidth,
      height: container.value ? container.value.offsetHeight : window.innerHeight,
    });
    const isSelectionMode = computed(() => selectedTool.value === Tools.Cursor);
    const isDrawingMode = computed(() => selectedTool.value === Tools.Pen || selectedTool.value === Tools.Eraser);
    const freeDrawingBrushInverted = computed(() => selectedTool.value === Tools.Eraser);
    return {
      container,
      stageConfig,
      isSelectionMode,
      isDrawingMode,
      freeDrawingBrushInverted,
    };
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.stageConfig.width = this.$refs.container ? (this.$refs.container as HTMLElement).offsetWidth : window.innerWidth;
      this.stageConfig.height = this.$refs.container ? (this.$refs.container as HTMLElement).offsetHeight : window.innerHeight;
      if (canvas.value instanceof fabric.Canvas) {
        canvas.value.setDimensions({ width: this.stageConfig.width, height: this.stageConfig.height });
      };
    });

    if (!(canvas.value instanceof fabric.Canvas)) {
      canvas.value = new fabric.Canvas('canvas', {
        width: this.stageConfig.width,
        height: this.stageConfig.height,
      });
      if (canvas_json.value) {
        canvas.value.loadFromJSON(canvas_json.value, canvas.value.renderAll.bind(canvas.value));
      }
    };

    if (this.$props.main) {
      canvas.value.on('mouse:move', handleMove);
      canvas.value.on('mouse:down', handleStart);
      canvas.value.on('mouse:up', handleEnd);

      canvas.value.freeDrawingBrush.color = selectedColor.value;

      canvas.value.selection = this.isSelectionMode;
      // canvas.value.freeDrawingBrush = new fabric.EraserBrush(canvas);
      canvas.value.isDrawingMode = this.isDrawingMode;
      // canvas.value.freeDrawingBrush = freeDrawingBrushInverted.value;
    } else {
      canvas.value.selection = false;
      canvas.value.isDrawingMode = false;
    };

    socket.value.onmessage = function (evt) {
      if (!canvas.value) return;
      console.log(evt.data);
      canvas_json.value = evt.data;
      canvas.value.loadFromJSON(canvas_json.value, canvas.value.renderAll.bind(canvas.value));
    };
  },
  beforeUnmount() {
    if (canvas.value instanceof fabric.Canvas) {
      canvas.value.off('mouse:move', handleMove);
      canvas.value.off('mouse:down', handleStart);
      canvas.value.off('mouse:up', handleEnd);

      canvas_json.value = JSON.stringify(canvas.value.toDatalessJSON());

      canvas.value.dispose();
      canvas.value = undefined;
    }
  },
  watch: {
    isDrawingMode(newValue) {
      if (canvas.value instanceof fabric.Canvas) {
        canvas.value.isDrawingMode = newValue;
      };
    },
    isSelectionMode(newValue) {
      if (canvas.value instanceof fabric.Canvas) {
        canvas.value.selection = newValue;
      };
    },
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
  // position: v-bind(containerpos);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
