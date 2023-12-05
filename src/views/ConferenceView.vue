<template>
  <span>You're in {{ conferenceId }} conference</span>
  <editable-canvas-component :fabricCanvas="fabricCanvas" />
  <div v-for="fabricCanvas in fabricCanvasArray">
    <static-canvas-component :fabricCanvas="fabricCanvas" />
  </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from 'vue';
import { storeToRefs } from 'pinia';

import { useUserStore } from '@/store';
import Conference, { ClientConferenceEventTypes, IClientConferenceEvent } from '@/canvasLogic/Conference';
import EditableCanvasComponent from '@/components/canvas/EditableCanvasComponent.vue';
import StaticCanvasComponent from '@/components/canvas/StaticCanvasComponent.vue';
import { FabricCanvas } from '@/canvasLogic/FabricCanvas';

const userStore = useUserStore();
const { conferenceId, user } = storeToRefs(userStore);

export default defineComponent({
  name: 'ConferenceView',
  components: {
    EditableCanvasComponent,
    StaticCanvasComponent,
  },
  data() {
    conferenceId.value = this.$route.params["id"] as string;
    let conference: Ref<Conference | undefined> = ref();
    const fabricCanvasArray: Ref<FabricCanvas[]> = ref([]);

    return {
      conferenceId,
      conference,
      fabricCanvasArray,
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
      this.fabricCanvasArray.push(fabricCanvas);
    },
    update(data: IClientConferenceEvent) {
      if (data.type === ClientConferenceEventTypes.CreateCanvas) {
        this.createCanvas(data);
      };
    },
  },
  computed: {
    fabricCanvas(): FabricCanvas | undefined {
      return user.value?.id ? this.fabricCanvasArray[user.value?.id] : undefined;
    },
  },
});
</script>

<style scoped lang="scss">
div {
  display: none;
}
</style>
