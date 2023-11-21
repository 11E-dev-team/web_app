<template>
  <div class="toolkit">
    <button @click="selectedTool = Tools.Cursor"><img src="@/assets/SpizdIconPack/Cursor.svg" /></button>
    <button @click="selectedTool = Tools.Text"><img src="@/assets/SpizdIconPack/Text.svg" /></button>
    <button @click="selectedTool = Tools.Shapes">
      <img v-if="selectedShape === Shapes.Rectangle" src="@/assets/SpizdIconPack/Shapes/Rectangle.svg" />
      <img v-else-if="selectedShape === Shapes.Arrow" src="@/assets/SpizdIconPack/Shapes/Arrow.svg" />
      <img v-else-if="selectedShape === Shapes.Line" src="@/assets/SpizdIconPack/Shapes/Line.svg" />
      <img v-else-if="selectedShape === Shapes.Ellipse" src="@/assets/SpizdIconPack/Shapes/Circle.svg" />
      <div class="shape-selector">
        <select v-model="selectedShape">
        <option v-for="[key, value] in Object.entries(Shapes)" :key="key" :value="key">{{ value }}</option>
        </select>
      </div>
    </button>
    <button @click="selectedTool = Tools.Pen"><img src="@/assets/SpizdIconPack/Pen.svg" /></button>
    <button @click="selectedTool = Tools.Eraser"><img src="@/assets/SpizdIconPack/Eraser.svg" /></button>
    <!-- <button @click="undo">Undo</button> -->
  </div>
    <!-- TODO: Move to Shapes chooser -->
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { useCanvasStateStore } from '@/store';
const canvasStateStore = useCanvasStateStore();
const { selectedTool, selectedShape } = storeToRefs(canvasStateStore);
import { Tools, Shapes } from '@/store/public_interfaces';
export default defineComponent({
  name: 'ToolKitComponent',
  data() {
    return {
      selectedTool,
      Tools,
      selectedShape,
      Shapes,
    }
  }
})
</script>

<style scoped lang="scss">
.toolkit {
  position: relative;
  z-index: 100;
  left: 32px;
  top: calc(50vh - 210px);

  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  gap: 16px;

  width: fit-content;

  border-radius: 16px;
  background: var(--buttons-secondary, #D7D7EF);

  button {
    width: 48px;
    height: 48px;

    background-color: transparent;
    border: none;

    img {
      width: 100%;
      height: 100%;
    }
  }
}

.shape-selector {
  display: flex;
  position: relative;
  top: -37px;
  left: 64px;
}
</style>
