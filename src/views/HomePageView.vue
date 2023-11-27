<template>
  <div class="canvas-container">
    <canvas-component main />
  </div>
  <students-side />
  <navigation-bar adaptive />
  <tool-kit />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import HeaderComponent from '@/components/HeaderComponent.vue';
import CanvasComponent from '@/components/CanvasComponent.vue';
import NavigationBar from '@/components/NavigationComponent.vue';
import ToolKit from '@/components/ToolKitComponent.vue';
import StudentsSide from '@/components/StudentsSideComponent.vue';

export default defineComponent({
  components: {
    HeaderComponent,
    CanvasComponent,
    NavigationBar,
    ToolKit,
    StudentsSide,
  },
});
</script>

<style scoped lang="scss">
.canvas-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}
</style>
