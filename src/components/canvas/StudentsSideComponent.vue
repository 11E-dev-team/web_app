<template>
  <div class="side">
    <div class="student-canvas">
      <static-canvas-component canvas-id="" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import StaticCanvasComponent from './StaticCanvasComponent.vue';

export default defineComponent({
  name: 'StudentsSideComponent',
  components: {
    StaticCanvasComponent,
  },
});
</script>

<style scoped lang="scss">
.side {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 16px;
  padding-top: 116px;
  z-index: 0;
  top: 0;
  left: 70vw;
  width: 30vw;
  height: 100vh;
  overflow-y: scroll;
  background: var(--buttons-secondary, #D7D7EF);
  border-radius: 16px 0 0 16px;

  .student-canvas {
    width: calc(30vw - 32px);
    height: calc((30vw - 32px) * (1920 / 1080));

    border-radius: 8px;

    background: var(--background, #E5E6F5);
  }
}
</style>
