<template>
  <div class="container" ref="container">
    <canvas id="canvas" ref="canvas_"></canvas>
  </div>
</template>

<script lang="ts">
import { reactive, defineComponent, ref, Ref } from 'vue';
import { fabric } from 'fabric';


let canvas_: Ref<fabric.Canvas | undefined> = ref<fabric.Canvas | undefined>(undefined);

export default defineComponent({
  name: 'StaticCanvasComponent',
  props: {
    canvasId: String,
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
    if (typeof canvas_.value === 'undefined') {
      canvas_.value = new fabric.Canvas('canvas_', {
        width: this.stageConfig.width,
        height: this.stageConfig.height,
      });
    };
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
