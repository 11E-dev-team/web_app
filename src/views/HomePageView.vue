<template>
  <HeaderComponent msg="КРОК ШИР 179dev" />
  <canvas-component />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import HeaderComponent from '@/components/HeaderComponent.vue';
import CanvasComponent from '@/components/CanvasComponent.vue';

export default defineComponent({
  components: {
    HeaderComponent,
    CanvasComponent,
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/main.scss';

.main-content {
  padding: $common-padding;
  overflow-y: auto;
  overscroll-behavior: contain;
  height: calc(100vh - ($header-height + $common-padding * 2) - $common-padding * 3); /* Subtract the header and footer heights from the viewport height */

  display: grid;
  grid-template-columns: repeat(3, auto);
  grid-template-rows: repeat(6, auto);
  gap: $common-padding;

  grid-template-areas:
    "groups calendar calendar"
    "groups calendar calendar"
    "groups calendar calendar"
    "groups calendar calendar"
    "groups nearest-events code"
    "groups nearest-events participate";
  
  .groups {
    grid-area: groups;
    background-color: aqua;
  }
  .calendar {
    grid-area: calendar;
    background-color: blueviolet;
  }
  .nearest-events {
    grid-area: nearest-events;
    background-color: chartreuse;
  }
  .code {
    grid-area: code;
    background-color: gold;
  }
  .participate {
    grid-area: participate;
    background-color: hotpink;
  }
}
</style>
