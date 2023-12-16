<template>
  <!-- static canvas -->
  <div
    ref="container"
    class="container"
  >
    <canvas :id="canvasContainerId" />
  </div>
</template>

<script lang="ts">
import { reactive, defineComponent, ref, Ref } from "vue";
import { fabric } from "fabric";

import { FabricCanvas } from "@/canvasLogic/FabricCanvas";

export default defineComponent({
    name: "StaticCanvasComponent",
    props: {
        fabricCanvas: {type: Object, required: true},
    },
    setup() {
        const container: Ref<HTMLElement | undefined> = ref<HTMLElement | undefined>(undefined);

        return {
            container,
        };
    },
    data() {
        const stageConfig: {width: number, height: number} = reactive({width: 0, height: 0});
        return {
            stageConfig,
        };
    },
    computed: {
        canvasContainerId() {
            return "static-canvas-" + this.$props.fabricCanvas?.id;
        },
    },
    watch: {
        fabricCanvas() {
            this.updateCanvas();
        },
    },
    mounted() {
        window.addEventListener("resize", () => {
            this.stageConfig.width = this.container ? this.container.offsetWidth : window.innerWidth;
            this.stageConfig.height = this.container ? this.container.offsetHeight : window.innerHeight;
            if (this.$props.fabricCanvas instanceof FabricCanvas) {
                this.$props.fabricCanvas.canvas.setDimensions({ width: this.stageConfig.width, height: this.stageConfig.height });
            }
        });

        this.updateCanvas();
    },
    methods: {
        updateCanvas() {
            if (
                this.$props.fabricCanvas
        && !(this.$props.fabricCanvas instanceof FabricCanvas
        && this.$props.fabricCanvas.canvas instanceof fabric.Canvas)
            ) {
                this.$props.fabricCanvas.canvas = new fabric.Canvas(
                    this.canvasContainerId, {
                        width: this.stageConfig.width,
                        height: this.stageConfig.height,
                    });
                this.$props.fabricCanvas.canvas.selection = false;
                this.$props.fabricCanvas.canvas.skipTargetFind = true;
            }
        
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
