<template>
  <div
    ref="canvasContainer"
    class="canvasContainer"
  >
    <canvas :id="canvasContainerId" />
  </div>
  <tool-kit :canvas="editableFabricCanvas" />
</template>

<script lang="ts">
import { reactive, defineComponent, ref } from "vue";
import { fabric } from "fabric";

import { Shapes_, Tools_ } from "@/shared/interfaces";
import { FabricCanvas } from "@/canvasLogic/FabricCanvas";
import ToolKit from "./ToolKitComponent.vue";

export default defineComponent({
    name: "EditableCanvasComponent",
    components: {
        ToolKit,
    },
    props: {
        fabricCanvas: {type: Object, required: true},
    },
    setup(props) {
        const canvasContainer = ref<HTMLElement | undefined>(undefined);
        const stageConfig = reactive<{width: number, height: number}>(canvasContainer.value ? {
            width: canvasContainer.value.offsetWidth,
            height: canvasContainer.value.offsetHeight,
        } : {
            width: window.innerWidth,
            height: window.innerHeight
        });

        const editableFabricCanvas: FabricCanvas = props.fabricCanvas as FabricCanvas;

        return {
            canvasContainer,
            stageConfig,
            editableFabricCanvas
        };
    },
    computed: {
        canvasContainerId() {
            return "editable-canvas-" + this.editableFabricCanvas?.id;
        },
    },
    watch: {
        editableFabricCanvas() {
            console.log("watch", this.editableFabricCanvas);
            this.updateCanvas();
        },
    },
    mounted() {
        window.addEventListener("resize", () => {
            this.stageConfig.width = this.canvasContainer ? this.canvasContainer.offsetWidth : window.innerWidth;
            this.stageConfig.height = this.canvasContainer ? this.canvasContainer.offsetHeight : window.innerHeight;
            if (this.editableFabricCanvas instanceof FabricCanvas) {
                this.editableFabricCanvas.canvas.setDimensions({ width: this.stageConfig.width, height: this.stageConfig.height });
            }
        });

        this.updateCanvas();
    },
    beforeUnmount() {
        if (this.editableFabricCanvas?.canvas instanceof fabric.Canvas) {
            this.editableFabricCanvas?.canvas.dispose();
        }
    },
    methods: {
        toolUpdatingHandler: function(tool: Tools_) {
            this.editableFabricCanvas?.changeTool(tool);
        },
        shapeUpdatingHandler(shape: Shapes_) {
            this.editableFabricCanvas?.changeShape(shape);
        },
        applyTransformations({x, y}: {x: number, y: number}, viewportTransform: number[] | undefined, zoom: number): {x: number, y: number} {
            return viewportTransform ? {
                x: (x - viewportTransform[4]) / zoom,
                y: (y - viewportTransform[5]) / zoom,
            }
                : {
                    x: x / zoom,
                    y: y / zoom,  
                };
        },
        updateCanvas() {
            if (this.editableFabricCanvas && !(this.editableFabricCanvas instanceof FabricCanvas && this.editableFabricCanvas.canvas instanceof fabric.Canvas))
                this.editableFabricCanvas.canvas = new fabric.Canvas(this.canvasContainerId, {
                    width: this.stageConfig.width,
                    height: this.stageConfig.height,
                });

            if (this.editableFabricCanvas instanceof FabricCanvas) {
                this.editableFabricCanvas.canvas.on("mouse:down", (event: fabric.IEvent<MouseEvent>) => {
                    if (!event.pointer)
                        return;
                    console.log(this.editableFabricCanvas.canvas.viewportTransform);
                    this.editableFabricCanvas?.mouseDown(
                        this.applyTransformations(
                            {x : event.pointer.x, y: event.pointer.y},
                            this.editableFabricCanvas.canvas.viewportTransform,
                            this.editableFabricCanvas.canvas.getZoom()
                        )
                    );
                });

                this.editableFabricCanvas.canvas.on("mouse:move", (event: fabric.IEvent) => {
                    if (!event.pointer)
                        return;
                    this.editableFabricCanvas?.mouseMove(
                        this.applyTransformations(
                            {x : event.pointer.x, y: event.pointer.y},
                            this.editableFabricCanvas.canvas.viewportTransform,
                            this.editableFabricCanvas.canvas.getZoom()
                        )
                    );
                });

                this.editableFabricCanvas.canvas.on("mouse:up", (event: fabric.IEvent) => {
                    if (!event.pointer)
                        return;
                    this.editableFabricCanvas?.mouseUp(
                        this.applyTransformations(
                            {x : event.pointer.x, y: event.pointer.y},
                            this.editableFabricCanvas.canvas.viewportTransform,
                            this.editableFabricCanvas.canvas.getZoom()
                        )
                    );
                });

                this.editableFabricCanvas.canvas.on("mouse:wheel", (event: fabric.IEvent<WheelEvent>) => {
                    let zoom: number = this.editableFabricCanvas.canvas.getZoom();
                    zoom *= 0.999 ** event.e.deltaY;
                    this.editableFabricCanvas.canvas.zoomToPoint({
                        x: event.e.offsetX, y: event.e.offsetY
                    }, zoom);
                    event.e.preventDefault();
                    event.e.stopPropagation();
                });

                this.editableFabricCanvas.canvas.on("object:added", (evt: fabric.IEvent) => {
                    const target = evt.target;
                    if (!target)
                        return;
                    if (
                        target instanceof fabric.Path
                        && (target.stroke === "rgba(0, 0, 0, 0)"
                        || target.stroke === "transparent"
                        )) {
                        this.editableFabricCanvas?.canvas?.remove(target);
                        this.editableFabricCanvas?.canvas?.requestRenderAll();
                    }
                    this.editableFabricCanvas?.broadcast();
                });

                this.editableFabricCanvas.canvas.on("after:render", () => {
                    this.editableFabricCanvas?.broadcast();
                });

                this.editableFabricCanvas.updateSettings();  
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

.canvasContainer {
  background-color: var(--background);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
