<template>
  <div class="canvas-container">
      <editable-canvas-component id="" />
    </div>
    <teachers-side />
    <navigation-bar />
    <tool-kit />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import HeaderComponent from '@/components/HeaderComponent.vue';
import EditableCanvasComponent from '@/components/canvas/EditableCanvasComponent.vue';
import NavigationBar from '@/components/canvas/NavigationComponent.vue';
import ToolKit from '@/components/canvas/ToolKitComponent.vue';
import TeachersSide from '@/components/canvas/TeachersSideComponent.vue';

export default defineComponent({
  name: 'TeacherView',
  components: {
      HeaderComponent,
      EditableCanvasComponent,
      NavigationBar,
      ToolKit,
      TeachersSide,
    },
});
</script>
