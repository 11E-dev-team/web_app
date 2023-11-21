<template>
  <canvas-component />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import HeaderComponent from '@/components/HeaderComponent.vue';
import CanvasComponent from '@/components/CanvasComponent.vue';

export default defineComponent({
  components: {
    HeaderComponent,
    CanvasComponent,
  },
});
</script>
