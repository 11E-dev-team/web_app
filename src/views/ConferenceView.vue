<template>
  <!-- TODO: Write a conference view and logic -->
  <span>You're in {{ conferenceId }} conference</span>
  <editable-canvas-component canvasId="0" :fabricCanvas="fabricCanvas" />
  <static-canvas-component />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { storeToRefs } from 'pinia';

import { useUserStore } from '@/store';
import Conference from '@/canvasLogic/Conference';
import EditableCanvasComponent from '@/components/canvas/EditableCanvasComponent.vue';
import StaticCanvasComponent from '@/components/canvas/StaticCanvasComponent.vue';
import { FabricCanvas } from '@/canvasLogic/FabricCanvas';

const userStore = useUserStore();
const { conferenceId } = storeToRefs(userStore);

export default defineComponent({
  name: 'ConferenceView',
  components: {
    EditableCanvasComponent,
    StaticCanvasComponent,
  },
  data() {
    conferenceId.value = this.$route.params["id"] as string;
    let conference: Conference | undefined;

    const fabricCanvas = new FabricCanvas(0);
    return {
      conferenceId,
      conference,
      fabricCanvas,
    }
  },
  mounted() {
    this.conference = new Conference(this.conferenceId);
    this.conference.subscribe(this.fabricCanvas);
    this.fabricCanvas.conference = this.conference;
  },
  unmounted() {
    this.conference?.leave();
  },
})
</script>
