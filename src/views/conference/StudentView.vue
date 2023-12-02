<template>
    <div class="canvas-container">
      <editable-canvas-component id="" />
    </div>
    <navigation-bar />
    <tool-kit />
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  import HeaderComponent from '@/components/HeaderComponent.vue';
  import EditableCanvasComponent from '@/components/canvas/EditableCanvasComponent.vue';
  import NavigationBar from '@/components/canvas/NavigationComponent.vue';
  import ToolKit from '@/components/canvas/ToolKitComponent.vue';
  import StudentsSide from '@/components/canvas/StudentsSideComponent.vue';
  
  export default defineComponent({
    components: {
      HeaderComponent,
      EditableCanvasComponent,
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
