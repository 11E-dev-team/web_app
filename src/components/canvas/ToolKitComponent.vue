<template>
  <div class="toolkit">
    <button id="cursor" @click="changeTool(Tools.Cursor)"><img src="@/assets/SpizdIconPack/Cursor.svg" /></button>
    <button id="text" @click="changeTool(Tools.Text)"><img src="@/assets/SpizdIconPack/Text.svg" /></button>
    <button id="shapes" @click="changeTool(Tools.Shapes)">
      <button @click="displayShapesSelector = !displayShapesSelector" style="width: 100%; height: 100%; padding: 0;">
        <img v-if="selectedShape === Shapes.Rectangle" src="@/assets/SpizdIconPack/Shapes/Rectangle.svg" />
        <img v-else-if="selectedShape === Shapes.Arrow" src="@/assets/SpizdIconPack/Shapes/Arrow.svg" />
        <img v-else-if="selectedShape === Shapes.Line" src="@/assets/SpizdIconPack/Shapes/Line.svg" />
        <img v-else-if="selectedShape === Shapes.Ellipse" src="@/assets/SpizdIconPack/Shapes/Circle.svg" />
      </button>
      <div v-if="displayShapesSelector" class="shape-selector">
        <button @click="changeShape(Shapes.Rectangle); displayShapesSelector = false">
          <img src="@/assets/SpizdIconPack/Shapes/Rectangle.svg" />
        </button>
        <button @click="changeShape(Shapes.Arrow); displayShapesSelector = false">
          <img src="@/assets/SpizdIconPack/Shapes/Arrow.svg" />
        </button>
        <button @click="changeShape(Shapes.Line); displayShapesSelector = false">
          <img src="@/assets/SpizdIconPack/Shapes/Line.svg" />
        </button>
        <button @click="changeShape(Shapes.Ellipse); displayShapesSelector = false">
          <img src="@/assets/SpizdIconPack/Shapes/Circle.svg" />
        </button>
      </div>
    </button>
    <button id="pen" @click="changeTool(Tools.Pen)"><img src="@/assets/SpizdIconPack/Pen.svg" /></button>
    <button id="delete" @click="deleteSelected"><img src="@/assets/SpizdIconPack/Trash.svg" /></button>
    <!-- <button @click="undo">Undo</button> -->
  </div>
    <!-- TODO: Move to Shapes chooser -->
</template>

<script lang="ts">
import { defineComponent, ref, Ref, PropType } from 'vue';
import { storeToRefs } from 'pinia';

import { useCanvasStateStore } from '@/store';
import { deleteSelected } from '@/utils/canvasLogic/deleteUtils';
import { Tools, Tools_, Shapes, Shapes_ } from '@/shared/interfaces';

export default defineComponent({
  name: 'ToolKitComponent',
  data() {
    const displayShapesSelector: Ref<boolean> = ref(false);
    const selectedShape: Ref<Shapes_> = ref(Shapes.Rectangle);
    return {
      Tools,
      Shapes,
      displayShapesSelector,
      selectedShape,
    }
  },
  methods: {
    changeTool(tool: Tools_) {
      this.$emit('update:tool', tool);
    },
    changeShape(shape: Shapes_) {
      this.$emit('update:shape', shape);
      this.selectedShape = shape;
    },
    deleteSelected,
  },
})
</script>

<style scoped lang="scss">
@import '@/assets/scss/main.scss';
.toolkit {
  position: absolute;
  z-index: 100;
  left: 8px;
  top: calc(50vh - 162.5px);

  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  gap: 16px;

  width: 64px;

  border: {
    style: var(--default-border-style, solid);
    radius: var(--external-border-radius, 8px);
    color: var(--default-border-color, var(--accent, #464AB4));
    width: var(--default-border-width, 2px);
  };
  background: var(--background, #E5E6F5);
  box-shadow: 2px 4px 4px 0px rgba(0, 0, 0, 0.25);

  button {
    width: 48px;
    height: 48px;

    background-color: transparent;
    border: none;

    img {
      width: 40px;
      height: 40px;
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
  top: -40px;
  left: 64px;

  width: fit-content;

  border: {
    style: var(--default-border-style, solid);
    radius: var(--external-border-radius, 8px);
    color: var(--default-border-color, var(--accent, #464AB4));
    width: var(--default-border-width, 2px);
  };
  background: var(--background, #E5E6F5);
  box-shadow: 2px 4px 4px 0px rgba(0, 0, 0, 0.25);

  button {
    width: 48px;
    height: 48px;
  }
}
</style>
