<template>
  <div class="container" ref="container">
    <canvas id="canvas" ref="canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { reactive, defineComponent, ref, Ref } from 'vue';
import { fabric } from 'fabric';

import { FabricCanvas } from '@/canvasLogic/FabricCanvas';

export default defineComponent({
  name: 'StaticCanvasComponent',
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
        this.stageConfig.width = this.container ? this.container.offsetWidth : window.innerWidth;
        this.stageConfig.height = this.container ? this.container.offsetHeight : window.innerHeight;
        if (this.$props.fabricCanvas instanceof FabricCanvas) {
            this.$props.fabricCanvas.canvas.setDimensions({ width: this.stageConfig.width, height: this.stageConfig.height });
        };
    });

    this.updateCanvas();
  },
  methods: {
    updateCanvas() {
      if (this.$props.fabricCanvas && !(this.$props.fabricCanvas instanceof FabricCanvas && this.$props.fabricCanvas.canvas instanceof fabric.Canvas))
        this.$props.fabricCanvas.canvas = new fabric.Canvas('canvas', {
            width: this.stageConfig.width,
            height: this.stageConfig.height,
        });
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
  // position: v-bind(containerpos);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
