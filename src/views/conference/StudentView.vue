<template>
  <!-- TODO: Write a conference view and logic -->
  <editable-canvas-component />
  <static-canvas-component />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import EditableCanvasComponent from '@/components/canvas/EditableCanvasComponent.vue';
import StaticCanvasComponent from '@/components/canvas/StaticCanvasComponent.vue';

export default defineComponent({
  name: 'StudentView',
  components: {
    EditableCanvasComponent,
    StaticCanvasComponent,
  },
});
</script>
