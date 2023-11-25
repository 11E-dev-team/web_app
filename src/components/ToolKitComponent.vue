<template>
  <div class="toolkit">
    <button @click="selectedTool = Tools.Cursor">Cursor</button>
    <button @click="selectedTool = Tools.Text">Text</button>
    <button @click="selectedTool = Tools.Shapes">Shapes</button>
    <button @click="selectedTool = Tools.Pen">Pen</button>
    <button @click="selectedTool = Tools.Eraser">Eraser</button>
    <!-- <button @click="undo">Undo</button> -->
    <!-- TODO: Move to Shapes chooser -->
    <div>
      <select v-model="selectedShape">
      <option v-for="[key, value] in Object.entries(Shapes)" :key="key" :value="key">{{ value }}</option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { storeToRefs } from 'pinia';

import { useCanvasStateStore } from '@/store';
import { Tools, Shapes } from '@/store/public_interfaces';
export default defineComponent({
  name: 'ToolKitComponent',
  data() {
    return {
      Tools,
      Shapes,
    }
  },
  setup() {
    const canvasStateStore = useCanvasStateStore();
    const { selectedTool, selectedShape } = storeToRefs(canvasStateStore);

    return {
      selectedTool,
      selectedShape,
    }
  },
})
</script>

<style scoped lang="scss">
.toolkit {
  position: relative;
  z-index: 100;
  left: 32px;
  top: 32px;

  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 16px;

  width: 80px;

  button {
    width: 48px;
    height: 48px;

    background-color: var(--accent, #464ab4);
  }
}
</style>
