<template>
  <!-- TODO: Write a conference view and logic -->
  <span>Welcome to the student view!</span>
  <div class="container"></div>
  <!-- <editable-canvas-component />
  <static-canvas-component /> -->
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

<style scoped lang="scss">
@import '@/assets/scss/main.scss';
.container {
  position: absolute;
  display: flex;
  top: 16px;
  right: auto;
  width: 580px;
  height: 320px;
  padding: {
    left: 16px;
    right: 16px;
    top: 16px;
    bottom: 8px;
  };
  border: {
    radius: 16px;
    width: 1px;    
    style: solid;
    color: var(--accent, #464AB4);
  };
  background: var(--background, #E5E6F5);
  box-shadow: 2px 4px 4px 0px rgba(0, 0, 0, 0.25);
  flex-shrink: 0;

  * {
    width: 48px;
    height: 48px;
    
    background-color: transparent;
  }
}
</style>