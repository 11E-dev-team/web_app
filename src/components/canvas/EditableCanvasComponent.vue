<template>
  <div class="canvasContainer" ref="canvasContainer">
    <canvas :id="canvasContainerId"></canvas>
  </div>
  <tool-kit :canvas="fabricCanvas" />
</template>

<script lang="ts">
import { reactive, defineComponent, ref, Ref } from 'vue';
import { fabric } from 'fabric';

import { FabricCanvas } from '@/canvasLogic/FabricCanvas';
import ToolKit from './ToolKitComponent.vue';
import { Shapes_, Tools_ } from '@/shared/interfaces';

export default defineComponent({
    name: 'EditableCanvasComponent',
    components: {
      ToolKit,
    },
    props: {
        fabricCanvas: {type: Object, required: true},
    },
    setup() {
        const canvasContainer = ref<HTMLElement | undefined>(undefined);
        const stageConfig = reactive<{width: number, height: number}>(canvasContainer.value ? {
            width: canvasContainer.value.offsetWidth,
            height: canvasContainer.value.offsetHeight,
        } : {
            width: window.innerWidth,
            height: window.innerHeight
        });

        return {
            canvasContainer,
            stageConfig
        }
    },
    mounted() {
        window.addEventListener('resize', () => {
            this.stageConfig.width = this.canvasContainer ? this.canvasContainer.offsetWidth : window.innerWidth;
            this.stageConfig.height = this.canvasContainer ? this.canvasContainer.offsetHeight : window.innerHeight;
            if (this.fabricCanvas instanceof FabricCanvas) {
                this.fabricCanvas.canvas.setDimensions({ width: this.stageConfig.width, height: this.stageConfig.height });
            };
        });

        this.updateCanvas();
    },
    beforeUnmount() {
        if (this.fabricCanvas?.canvas instanceof fabric.Canvas) {
            this.fabricCanvas?.canvas.dispose();
        }
    },
    methods: {
        toolUpdatingHandler: function(tool: Tools_) {
            this.fabricCanvas?.changeTool(tool);
        },
        shapeUpdatingHandler(shape: Shapes_) {
            this.fabricCanvas?.changeShape(shape);
        },
        updateCanvas() {
            if (this.fabricCanvas && !(this.fabricCanvas instanceof FabricCanvas && this.fabricCanvas.canvas instanceof fabric.Canvas))
                this.fabricCanvas.canvas = new fabric.Canvas(this.canvasContainerId, {
                    width: this.stageConfig.width,
                    height: this.stageConfig.height,
                });

            if (this.fabricCanvas instanceof FabricCanvas) {
                this.fabricCanvas.canvas.on('mouse:down', (event: fabric.IEvent<MouseEvent>) => {
                    if (!event.pointer)
                        return;
                    console.log(this.fabricCanvas.canvas.viewportTransform);
                    this.fabricCanvas?.mouseDown({
                        x: (event.pointer.x - this.fabricCanvas.canvas.viewportTransform[4]) / this.fabricCanvas.canvas.getZoom(),
                        y: (event.pointer.y - this.fabricCanvas.canvas.viewportTransform[5]) / this.fabricCanvas.canvas.getZoom(),
                    });
                });

                this.fabricCanvas.canvas.on('mouse:move', (event: fabric.IEvent) => {
                    if (!event.pointer)
                        return;
                    this.fabricCanvas?.mouseMove({
                        x: (event.pointer.x - this.fabricCanvas.canvas.viewportTransform[4]) / this.fabricCanvas.canvas.getZoom(),
                        y: (event.pointer.y - this.fabricCanvas.canvas.viewportTransform[5]) / this.fabricCanvas.canvas.getZoom(),
                    });
                });

                this.fabricCanvas.canvas.on('mouse:up', (event: fabric.IEvent) => {
                    if (!event.pointer)
                        return;
                    this.fabricCanvas?.mouseUp({
                        x: (event.pointer.x - this.fabricCanvas.canvas.viewportTransform[4]) / this.fabricCanvas.canvas.getZoom(),
                        y: (event.pointer.y - this.fabricCanvas.canvas.viewportTransform[5]) / this.fabricCanvas.canvas.getZoom(),
                    });
                });

                this.fabricCanvas.canvas.on('mouse:wheel', (event: fabric.IEvent<WheelEvent>) => {
                    let zoom: number = this.fabricCanvas.canvas.getZoom();
                    zoom *= 0.999 ** event.e.deltaY;
                    this.fabricCanvas.canvas.zoomToPoint({
                        x: event.e.offsetX, y: event.e.offsetY
                    }, zoom);
                    event.e.preventDefault();
                    event.e.stopPropagation();
                });

                this.fabricCanvas.canvas.on('object:added', (evt: fabric.IEvent) => {
                    const target = evt.target;
                    if (!target)
                        return;
                    if (
                        target instanceof fabric.Path
                        && (target.stroke === 'rgba(0, 0, 0, 0)'
                        || target.stroke === 'transparent'
                    )) {
                        this.fabricCanvas?.canvas?.remove(target);
                        this.fabricCanvas?.canvas?.requestRenderAll();
                    }
                    this.fabricCanvas?.broadcast();
                });

                this.fabricCanvas.canvas.on('after:render', () => {
                    this.fabricCanvas?.broadcast();
                });

                this.fabricCanvas.updateSettings();  
            };
        },
    },
    watch: {
        fabricCanvas() {
            console.log("watch", this.fabricCanvas);
            this.updateCanvas();
        },
    },
    computed: {
        canvasContainerId() {
            return "editable-canvas-" + this.fabricCanvas?.id;
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

.canvasContainer {
  background-color: var(--background);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
