<template>
  <div class="container" ref="container">
    <canvas id="canvas" ref="canvas"></canvas>
  </div>
  <tool-kit @update:tool="toolUpdatingHandler" @update:shape="shapeUpdatingHandler" />
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
        fabricCanvas: Object,
    },
    data() {
        const container: Ref<HTMLElement | undefined> = ref<HTMLElement | undefined>(undefined);
        const stageConfig = reactive({
            width: container.value ? container.value.offsetWidth : window.innerWidth,
            height: container.value ? container.value.offsetHeight : window.innerHeight,
        });
        return {
            container,
            stageConfig,
        };
    },
    mounted() {
        window.addEventListener('resize', () => {
            this.stageConfig.width = window.innerWidth;
            this.stageConfig.height = window.innerHeight;
            if (this.$props.fabricCanvas instanceof FabricCanvas) {
                this.$props.fabricCanvas.canvas.setDimensions({ width: this.stageConfig.width, height: this.stageConfig.height });
            };
        });

        this.updateCanvas();
    },
    beforeUnmount() {
        if (this.$props.fabricCanvas?.canvas instanceof fabric.Canvas) {
            this.$props.fabricCanvas?.canvas.dispose();
        }
    },
    methods: {
        toolUpdatingHandler(tool: Tools_) {
            this.$props.fabricCanvas?.changeTool(tool);
        },
        shapeUpdatingHandler(shape: Shapes_) {
            this.$props.fabricCanvas?.changeShape(shape);
        },
        updateCanvas() {
            if (this.$props.fabricCanvas && !(this.$props.fabricCanvas instanceof FabricCanvas && this.$props.fabricCanvas.canvas instanceof fabric.Canvas))
            this.$props.fabricCanvas.canvas = new fabric.Canvas('canvas', {
                width: this.stageConfig.width,
                height: this.stageConfig.height,
            });

            if (this.$props.fabricCanvas instanceof FabricCanvas) {
                this.$props.fabricCanvas.canvas.on('mouse:down', (event: fabric.IEvent) => {
                    if (!event.pointer)
                        return;
                    this.$props.fabricCanvas?.mouseDown({
                        x: event.pointer.x,
                        y: event.pointer.y,
                    });
                });

                this.$props.fabricCanvas.canvas.on('mouse:move', (event: fabric.IEvent) => {
                    if (!event.pointer)
                        return;
                    this.$props.fabricCanvas?.mouseMove({
                        x: event.pointer.x,
                        y: event.pointer.y,
                    });
                });

                this.$props.fabricCanvas.canvas.on('mouse:up', (event: fabric.IEvent) => {
                    if (!event.pointer)
                        return;
                    this.$props.fabricCanvas?.mouseUp({
                        x: event.pointer.x,
                        y: event.pointer.y,
                    });
                });

                this.$props.fabricCanvas.canvas.on('object:added', (evt: fabric.IEvent) => {
                    const target = evt.target;
                    if (!target)
                        return;
                    if (target instanceof fabric.Path && target.stroke === 'rgba(0, 0, 0, 0)') {
                        this.$props.fabricCanvas?.canvas?.remove(target);
                        this.$props.fabricCanvas?.canvas?.requestRenderAll();
                    }
                    this.fabricCanvas?.broadcast();
                });

                this.$props.fabricCanvas.canvas.on('object:modified', () => {
                    this.fabricCanvas?.broadcast();
                });

                this.$props.fabricCanvas.updateSettings();  
            };
        },
    },
    watch: {
        fabricCanvas() {
            this.updateCanvas();
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
