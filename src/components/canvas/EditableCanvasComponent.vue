<template>
  <div class="container" ref="container">
    <canvas id="canvas" ref="canvas"></canvas>
  </div>
  <tool-kit @update:tool="fabricCanvas?.changeTool" @update:shape="fabricCanvas?.changeShape" />
</template>

<script lang="ts">
import { reactive, computed, defineComponent, ref, Ref } from 'vue';
import { fabric } from 'fabric';

import { sendToBackend } from '@/utils/utils';
import Conference from '@/canvasLogic/Conference';
import { FabricCanvas } from '@/canvasLogic/FabricCanvas';
import ToolKit from './ToolKitComponent.vue';

export default defineComponent({
    name: 'EditableCanvasComponent',
    components: {
      ToolKit,
    },
    props: {
        canvasId: { type: String, required: true },
        conference: Conference,
    },
    data() {
        const container: Ref<HTMLElement | undefined> = ref<HTMLElement | undefined>(undefined);
        const stageConfig = reactive({
            width: container.value ? container.value.offsetWidth : window.innerWidth,
            height: container.value ? container.value.offsetHeight : window.innerHeight,
        });
        let fabricCanvas = ref<FabricCanvas | undefined>(undefined);
        return {
            container,
            stageConfig,
            fabricCanvas,
        };
    },
    mounted() {
        if (!(this.fabricCanvas instanceof FabricCanvas && this.fabricCanvas.canvas instanceof fabric.Canvas))
            this.fabricCanvas = new FabricCanvas(
                this.canvasId,
                new fabric.Canvas(
                    'canvas',
                    {
                        width: this.stageConfig.width,
                        height: this.stageConfig.height,
                    }
                )
            );

        window.addEventListener('resize', () => {
            this.stageConfig.width = window.innerWidth;
            this.stageConfig.height = window.innerHeight;
            if (this.fabricCanvas instanceof FabricCanvas) {
                this.fabricCanvas.canvas.setDimensions({ width: this.stageConfig.width, height: this.stageConfig.height });
            }
            ;
        });


        this.fabricCanvas.canvas.on('mouse:down', (event: fabric.IEvent) => {
            if (!event.pointer)
                return;
            this.fabricCanvas?.mouseDown({
                x: event.pointer.x,
                y: event.pointer.y,
            });
        });

        this.fabricCanvas.canvas.on('mouse:move', (event: fabric.IEvent) => {
            if (!event.pointer)
                return;
            this.fabricCanvas?.mouseMove({
                x: event.pointer.x,
                y: event.pointer.y,
            });
        });

        this.fabricCanvas.canvas.on('mouse:up', (event: fabric.IEvent) => {
            if (!event.pointer)
                return;
            this.fabricCanvas?.mouseUp({
                x: event.pointer.x,
                y: event.pointer.y,
            });
        });

        this.fabricCanvas.canvas.on('object:added', (evt: fabric.IEvent) => {
            const target = evt.target;
            if (!target)
                return;
            if (target instanceof fabric.Path && target.stroke === 'rgba(0, 0, 0, 0)') {
                this.fabricCanvas?.canvas?.remove(target);
                this.fabricCanvas?.canvas?.requestRenderAll();
            }
            if (this.conference)
                sendToBackend(this.conference);
        });

        this.fabricCanvas.canvas.on('object:modified', () => {
            if (this.conference)
                sendToBackend(this.conference);
        });

        this.fabricCanvas.updateSettings();
    },
    beforeUnmount() {
        if (this.fabricCanvas?.canvas instanceof fabric.Canvas) {
            this.fabricCanvas?.canvas.dispose();
        }
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
