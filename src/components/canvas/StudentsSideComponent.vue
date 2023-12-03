<!-- <template>
  <div class="side">
    <div class="student-canvas">
      <static-canvas-component canvas-id="" />
    </div>
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
});
</script>

<style scoped lang="scss">
.side {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 16px;
  padding-top: 116px;
  z-index: 0;
  top: 0;
  left: 70vw;
  width: 30vw;
  height: 100vh;
  overflow-y: scroll;
  background: var(--buttons-secondary, #D7D7EF);
  border-radius: 16px 0 0 16px;

  .student-canvas {
    width: calc(30vw - 32px);
    height: calc((30vw - 32px) * (1920 / 1080));

    border-radius: 8px;
    border-color: var(--accent, #464AB4);
    border-width: 2px;
    border-style: solid;

    background: var(--background, #E5E6F5);
  }
}
</style> -->


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
    navbarRight () {
      return this.adaptive ? 'calc(15vw - 138px)' : '16px';
    },
  }
});
</script>

<style scoped lang="scss">
.teacher-canvas {
  position: absolute;
  display: flex;
  align-items: center;
  top: 100px;
  right: v-bind(navbarRight);
  padding: {
    left: 16px;
    right: 16px;
    top: 16px;
    bottom: 8px;
  };

  width: calc(30vw - 32px);
  height: 300px;

  border: {
    style: solid;
    radius: 16px;
    color: var(--accent, #464AB4);
    width: 1px;
  }
  background: var(--background, #E5E6F5);
}
</style>
