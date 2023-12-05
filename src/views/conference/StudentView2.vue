<template>
    <div class="editable-canvas-container">
      <editable-canvas-component id="" />
    </div>
    <div class="static-canvas-container">
      <StaticCanvasComponent id=""/>
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
  import StaticCanvasComponent from '@/components/canvas/StaticCanvasComponent.vue';

  export default defineComponent({
    name: 'StudentView',
    components: {
      HeaderComponent,
      EditableCanvasComponent,
      StaticCanvasComponent,
      NavigationBar,
      ToolKit,
      StudentsSide,
    },
  });
  </script>
  
  <style scoped lang="scss">
  .editable-canvas-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 50vw;
    height: 100vh;
    z-index: 1;
  }
  .static-canvas-container {
    position: absolute;
    top: 0;
    z-index: 100;
    left: 50vw;
    width: 50vw;
    height: 100vh;
    border: {
        left: {
            style: var(--default-border-style, solid);
            color: var(--default-border-color, var(--accent, #464AB4));
            width: var(--default-border-width, 2px);
        };
    };
  }
  </style>
