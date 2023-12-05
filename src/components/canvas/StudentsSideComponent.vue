<template>
  <div class="teacher-canvas">
    <static-canvas-component canvas-id="" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import StaticCanvasComponent from './StaticCanvasComponent.vue';

export default defineComponent({
  name: 'StudentsSideComponent',
  components: {
    StaticCanvasComponent,
  },
  props: {
    adaptive: Boolean,
  },
  computed: {
    StudentsSideRight () {
      return this.adaptive ? 'calc(15vw - 138px)' : '8px';
    },
  }
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/main.scss';
.teacher-canvas {
  position: absolute;
  display: flex;
  align-items: center;
  top: 96px;
  right: v-bind(StudentsSideRight);
  padding: {
    left: 16px;
    right: 16px;
    top: 16px;
    bottom: 8px;
  };
  box-shadow: 2px 4px 4px 0px rgba(0, 0, 0, 0.25);


  width: calc(30vw - 32px);
  height: 300px;

  border: {
    style: var(--default-border-style, solid);
    radius: var(--external-border-radius, 16px);
    color: var(--default-border-color, var(--accent, #464AB4));
    width: var(--default-border-width, 2px);
  }
  background: var(--background, #E5E6F5);
}
</style>
