<template>
  <!-- TODO: Write a conference view and logic -->
  <span>You're in {{ conferenceId }} conference</span>
  <editable-canvas-component />
  <static-canvas-component />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { storeToRefs } from 'pinia';

import { useUserStore } from '@/store';
import Conference from '@/canvasLogic/Conference';
import EditableCanvasComponent from '@/components/canvas/EditableCanvasComponent.vue';
import StaticCanvasComponent from '@/components/canvas/StaticCanvasComponent.vue';

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
    return {
      conferenceId,
      conference,
    }
  },
  mounted() {
    this.conference = new Conference(this.conferenceId);
  },
  unmounted() {
    this.conference?.leave();
  },
})
</script>
