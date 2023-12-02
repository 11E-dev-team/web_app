<template>
  <div class="container" ref="container">
    <canvas id="canvas" ref="canvas"></canvas>
  </div>
  <tool-kit @update:tool="changeTool" />
</template>

<script lang="ts">
import { reactive, computed, defineComponent, ref, Ref } from 'vue';
import { storeToRefs } from 'pinia';
import { fabric } from 'fabric';

import { useCanvasStore, useCanvasStateStore } from '@/store';
import { Tools, Tools_, Shapes_ } from '@/shared/interfaces';
import { sendToBackend } from '@/utils/utils';
import Conference from '@/canvasLogic/Conference';
import FabricDrawer from '@/canvasLogic/FabricDrawer';
import { CanvasMouse } from '@/canvasLogic/Canvas';
import ToolKit from './ToolKitComponent.vue';

const { canvas, canvas_json, currentShape } = storeToRefs(useCanvasStore());
const { selectedColor } = storeToRefs(useCanvasStateStore());

export default defineComponent({
    name: 'EditableCanvasComponent',
    components: {
      ToolKit,
    },
    props: {
        canvasId: String,
        conference: Conference,
    },
    data() {
        const container: Ref<HTMLElement | undefined> = ref<HTMLElement | undefined>(undefined);
        const stageConfig = reactive({
            width: container.value ? container.value.offsetWidth : window.innerWidth,
            height: container.value ? container.value.offsetHeight : window.innerHeight,
        });
        const selectedTool: Ref<Tools_> = ref(Tools.Cursor);
        const isSelectionMode = computed(() => selectedTool.value === Tools.Cursor);
        const isDrawingMode = computed(() => selectedTool.value === Tools.Pen || selectedTool.value === Tools.Eraser);
        const freeDrawingBrushInverted = computed(() => selectedTool.value === Tools.Eraser);
        const canvasMouse: CanvasMouse = new CanvasMouse();
        return {
            container,
            stageConfig,
            isSelectionMode,
            isDrawingMode,
            freeDrawingBrushInverted,
            canvasMouse,
        };
    },
    mounted() {
        window.addEventListener('resize', () => {
            this.stageConfig.width = window.innerWidth;
            this.stageConfig.height = window.innerHeight;
            if (canvas.value instanceof fabric.Canvas) {
                canvas.value.setDimensions({ width: this.stageConfig.width, height: this.stageConfig.height });
            }
            ;
        });
        if (!(canvas.value instanceof fabric.Canvas)) {
            canvas.value = new fabric.Canvas('canvas', {
                width: this.stageConfig.width,
                height: this.stageConfig.height,
            });
            if (canvas_json.value) {
                canvas.value.loadFromJSON(canvas_json.value, canvas.value.renderAll.bind(canvas.value));
            }
        }
        ;
        const drawer: FabricDrawer = new FabricDrawer(canvas.value);
        const canvasMouse: CanvasMouse = new CanvasMouse();
        this.canvasMouse = canvasMouse;
        canvas.value.on('mouse:down', (event: fabric.IEvent) => {
            if (!event.pointer)
                return;
            canvasMouse.down({
                x: event.pointer.x,
                y: event.pointer.y,
            });
            if (canvasMouse.currentObject)
                drawer.add(canvasMouse.currentObject);
        });
        canvas.value.on('mouse:move', (event: fabric.IEvent) => {
            if (!event.pointer)
                return;
            canvasMouse.move({
                x: event.pointer.x,
                y: event.pointer.y,
            });
            if (canvasMouse.currentObject)
                drawer.change(canvasMouse.currentObject);
        });
        canvas.value.on('mouse:up', (event: fabric.IEvent) => {
            if (!event.pointer)
                return;
            canvasMouse.up({
                x: event.pointer.x,
                y: event.pointer.y,
            });
            if (canvasMouse.currentObject)
                drawer.end(canvasMouse.currentObject);
        });
        canvas.value.on('object:added', (evt: fabric.IEvent) => {
            const target = evt.target;
            if (!target)
                return;
            if (target instanceof fabric.Path && target.stroke === 'rgba(0, 0, 0, 0)') {
                canvas.value?.remove(target);
                canvas.value?.requestRenderAll();
            }
            if (this.conference)
                sendToBackend(this.conference);
        });
        canvas.value.on('object:modified', () => {
            if (this.conference)
                sendToBackend(this.conference);
        });
        canvas.value.freeDrawingBrush.color = this.isDrawingMode ? selectedColor.value : 'rgba(0, 0, 0, 0)';
        canvas.value.selection = this.isSelectionMode;
        // canvas.value.freeDrawingBrush = new fabric.EraserBrush(canvas);
        canvas.value.isDrawingMode = (this.isDrawingMode || !this.isSelectionMode);
        // canvas.value.freeDrawingBrush = freeDrawingBrushInverted.value;
    },
    beforeUnmount() {
        if (canvas.value instanceof fabric.Canvas) {
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
            }
            ;
        },
        isSelectionMode(newValue) {
            if (canvas.value instanceof fabric.Canvas) {
                canvas.value.selection = newValue;
                canvas.value.isDrawingMode = (this.isDrawingMode || !newValue);
                canvas.value.freeDrawingBrush.color = this.isDrawingMode ? selectedColor.value : 'rgba(0, 0, 0, 0)';
            }
            ;
        },
    },
    methods: {
      changeTool(tool: Tools_) {
        this.canvasMouse.changeTool(tool);
      },
      changeShape(shape: Shapes_) {
        this.canvasMouse.changeShape(shape);
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
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
