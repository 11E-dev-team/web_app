<template>
  <span>You're {{ conference?.userData?.id }} in {{ conferenceId }} conference, you have {{ conference?.userData?.role }} role</span>

  <div v-for="fabricCanvas in editableFabricCanvasArray">
    <editable-canvas-component :fabricCanvas="fabricCanvas" />
  </div>
  <div v-for="fabricCanvas in staticFabricCanvasArray">
    <static-canvas-component :fabricCanvas="fabricCanvas" />
  </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from 'vue';

import Conference, { ClientConferenceEventTypes, IClientConferenceEvent } from '@/canvasLogic/Conference';
import EditableCanvasComponent from '@/components/canvas/EditableCanvasComponent.vue';
import StaticCanvasComponent from '@/components/canvas/StaticCanvasComponent.vue';
import { FabricCanvas } from '@/canvasLogic/FabricCanvas';

export default defineComponent({
  name: 'ConferenceView',
  components: {
    EditableCanvasComponent,
    StaticCanvasComponent,
  },
  data() {
    const conferenceId: string = this.$route.params["id"] as string;
    let conference: Ref<Conference | undefined> = ref();
    const staticFabricCanvasArray: Ref<FabricCanvas[]> = ref([]);
    const editableFabricCanvasArray: Ref<FabricCanvas[]> = ref([]);

    return {
      conferenceId,
      conference,
      staticFabricCanvasArray,
      editableFabricCanvasArray,
    }
  },
  mounted() {
    this.conference = new Conference(this, this.conferenceId);
  },
  unmounted() {
    this.conference?.leave();
  },
  methods: {
    createCanvas(data: IClientConferenceEvent) {
      const fabricCanvas = new FabricCanvas(data.data.id);
      if (this.conference) fabricCanvas.conference = this.conference;
      this.conference?.subscribe(fabricCanvas);
      if (data.data.id === this.conference?.userData?.id) {
        this.editableFabricCanvasArray.push(fabricCanvas);
      } else {
        this.staticFabricCanvasArray.push(fabricCanvas);
      };
    },
    update(data: IClientConferenceEvent) {
      if (data.type === ClientConferenceEventTypes.CreateCanvas) {
        this.createCanvas(data);
      };
    },
  },
});
</script>
