<template>
  <div class="toolkit">
    <button id="cursor" @click="selectedTool = Tools.Cursor"><img src="@/assets/SpizdIconPack/Cursor.svg" /></button>
    <button id="text" @click="selectedTool = Tools.Text"><img src="@/assets/SpizdIconPack/Text.svg" /></button>
    <button id="shapes" @click="selectedTool = Tools.Shapes">
      <button @click="displayShapesSelector = !displayShapesSelector" style="width: 100%; height: 100%; padding: 0;">
        <img v-if="selectedShape === Shapes.Rectangle" src="@/assets/SpizdIconPack/Shapes/Rectangle.svg" />
        <img v-else-if="selectedShape === Shapes.Arrow" src="@/assets/SpizdIconPack/Shapes/Arrow.svg" />
        <img v-else-if="selectedShape === Shapes.Line" src="@/assets/SpizdIconPack/Shapes/Line.svg" />
        <img v-else-if="selectedShape === Shapes.Ellipse" src="@/assets/SpizdIconPack/Shapes/Circle.svg" />
      </button>
      <div v-if="displayShapesSelector" class="shape-selector">
        <button @click="selectedShape = Shapes.Rectangle; displayShapesSelector = false">
          <img src="@/assets/SpizdIconPack/Shapes/Rectangle.svg" />
        </button>
        <button @click="selectedShape = Shapes.Arrow; displayShapesSelector = false">
          <img src="@/assets/SpizdIconPack/Shapes/Arrow.svg" />
        </button>
        <button @click="selectedShape = Shapes.Line; displayShapesSelector = false">
          <img src="@/assets/SpizdIconPack/Shapes/Line.svg" />
        </button>
        <button @click="selectedShape = Shapes.Ellipse; displayShapesSelector = false">
          <img src="@/assets/SpizdIconPack/Shapes/Circle.svg" />
        </button>
      </div>
    </button>
    <button id="pen" @click="selectedTool = Tools.Pen"><img src="@/assets/SpizdIconPack/Pen.svg" /></button>
    <button id="delete" @click="deleteSelected"><img src="@/assets/SpizdIconPack/Trash.svg" /></button>
    <!-- <button @click="undo">Undo</button> -->
  </div>
    <!-- TODO: Move to Shapes chooser -->
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue';
import { storeToRefs } from 'pinia';

import { useCanvasStateStore } from '@/store';
import { Tools, Shapes } from '@/store/public_interfaces';
import { deleteSelected } from '@/utils/canvasLogic/deleteUtils';

export default defineComponent({
  name: 'ToolKitComponent',
  data() {
    const displayShapesSelector: Ref<boolean> = ref(false);
    return {
      Tools,
      Shapes,
      displayShapesSelector,
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
  methods: {
    deleteSelected,
  }
})
</script>

<style scoped lang="scss">
@import '@/assets/scss/main.scss';
.toolkit {
  position: absolute;
  z-index: 100;
  left: 32px;
  top: calc(50vh - 162.5px);

  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  gap: 16px;

  width: fit-content;

  border-radius: 16px;
  border: 2px solid var(--accent, #464AB4);
  background: var(--background, #E5E6F5);
  box-shadow: 2px 4px 4px 0px rgba(0, 0, 0, 0.25);

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
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  justify-items: center;
  padding: 8px;
  gap: 16px;
  position: relative;
  top: -58px;
  left: 64px;

  width: fit-content;

  border-radius: 16px;
  border: 2px solid var(--accent, #464AB4);
  background: var(--background, #E5E6F5);
  box-shadow: 2px 4px 4px 0px rgba(0, 0, 0, 0.25);

  button {
    width: 48px;
    height: 48px;
  }
}
</style>
