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
const { mainSocket } = storeToRefs(userStore);
import { fabric } from 'fabric';

import { Tools } from '@/store/public_interfaces';

import { startShape, shape, endShape } from '@/utils/canvasLogic/shapes';
import { startText } from '@/utils/canvasLogic/text';
import { sendToBackend } from '@/utils/utils';

import ToolKit from './ToolKitComponent.vue';
import NavigationBar from './NavigationComponent.vue';

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
      canvas.value?.setActiveObject(currentShape.value);
      selectedTool.value = Tools.Cursor;
      canvas.value?.requestRenderAll();
      break;
    default:
      selectedTool.value = Tools.Cursor;
      break;
  }
}

function handleKeyDown(evt: KeyboardEvent): void {
  switch (evt.key) {
    case 'Backspace' || 'Delete':
      break;
  }
}

// Handle undo
function undo(): void {
  // TODO: Undo the last action
}

let canvas_: fabric.Canvas | undefined = undefined;

export default defineComponent({
  name: 'CanvasComponent',
  components: {
    ToolKit,
    NavigationBar,
  },
  props: {
    main: Boolean,
    isEditable: Boolean,
    canvasId: {
      type: Number,
      default: 0,
    },
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
    if (this.$props.main) {
      window.addEventListener('resize', () => {
        this.stageConfig.width = window.innerWidth;
        this.stageConfig.height = window.innerHeight;
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

      mainSocket.value.onopen = function () {
        console.log('Connection established');
      };

      canvas.value.on('mouse:move', handleMove);
      canvas.value.on('mouse:down', handleStart);
      canvas.value.on('mouse:up', handleEnd);
      canvas.value.on('object:added', (evt: fabric.IEvent) => {
        const target = evt.target;
        if (!target) return;
        if (target instanceof fabric.Path && target.stroke === 'rgba(0, 0, 0, 0)') {
          canvas.value?.remove(target);
          canvas.value?.requestRenderAll();
        }
      });

      canvas.value.freeDrawingBrush.color = this.isDrawingMode ? selectedColor.value : 'rgba(0, 0, 0, 0)';

      canvas.value.selection = this.isSelectionMode;
      // canvas.value.freeDrawingBrush = new fabric.EraserBrush(canvas);
      canvas.value.isDrawingMode = (this.isDrawingMode || !this.isSelectionMode);
      // canvas.value.freeDrawingBrush = freeDrawingBrushInverted.value;

      mainSocket.value.onmessage = function (evt) {
        if (!canvas.value) return;
        console.log(evt.data);
        canvas_json.value = evt.data;
        canvas.value.loadFromJSON(canvas_json.value, canvas.value.renderAll.bind(canvas.value));
      };
    } else {
      if (typeof canvas_ === 'undefined') {
        canvas_ = new fabric.Canvas('canvas', {
          width: this.stageConfig.width,
          height: this.stageConfig.height,
        });
      };

      const { canvasId } = this.$props;
      // socketsInSession.value[canvasId].onopen = function () {
      //   console.log('Connection with ' + canvasId + ' established');
      // }
      // canvas_.selection = false;
      // canvas_.isDrawingMode = false;

      // socketsInSession.value[canvasId].onmessage = function (evt) {
      //   if (!canvas_) return;
      //   console.log(evt.data);
      //   const json = evt.data;
      //   canvas_.loadFromJSON(json, canvas_.renderAll.bind(canvas_));
      // };
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
        canvas.value.isDrawingMode = (newValue || !this.isSelectionMode);
        canvas.value.freeDrawingBrush.color = this.isDrawingMode ? selectedColor.value : 'rgba(0, 0, 0, 0)';
      };
    },
    isSelectionMode(newValue) {
      if (canvas.value instanceof fabric.Canvas) {
        canvas.value.selection = newValue;
        canvas.value.isDrawingMode = (this.isDrawingMode || !newValue);
        canvas.value.freeDrawingBrush.color = this.isDrawingMode ? selectedColor.value : 'rgba(0, 0, 0, 0)';
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
