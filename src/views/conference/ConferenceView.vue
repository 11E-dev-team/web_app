<template>
  <span>You're {{ conference?.userData?.id }} in {{ conferenceId }} conference, you have {{ conference?.userData?.role }} role</span>

  <!-- TeachersView -->
  <div v-if="conference?.userData?.id == '0'" id="TeacherView">
    <div v-for="fabricCanvas in editableFabricCanvasArray">
      <editable-canvas-component :fabricCanvas="fabricCanvas" />
    </div>
    <div class="side">
      <div v-for="fabricCanvas in staticFabricCanvasArray" class="student-canvas">
        <static-canvas-component :fabricCanvas="fabricCanvas" />
      </div>
    </div>
  </div>

  <!-- StudentsView -->
  <div v-else id="StudentView">
    <div v-for="fabricCanvas in editableFabricCanvasArray">
      <editable-canvas-component :fabricCanvas="fabricCanvas" />
    </div>

    <div class="teacher-canvas">
      <div v-for="fabricCanvas in staticFabricCanvasArray">
        <static-canvas-component :fabricCanvas="fabricCanvas" />
      </div>
    </div>
  </div>

  <div class="navbar">
    <RouterLink to="/">
      <img src="@/assets/SpizdIconPack/exit.svg" alt="logo">
    </RouterLink> <!-- home -->
    <!-- <button> -->
    <!-- <img src="@/assets/SpizdIconPack/settingsIcon.svg" alt="logo"> -->
    <!-- </button> settings -->
    <!-- <button> -->
    <!-- <img src="@/assets/SpizdIconPack/groupIcon.svg" alt="logo"> -->
    <!-- </button> group preview -->
    <button>
      <img src="@/assets/SpizdIconPack/desksIcon.svg" alt="logo">
    </button> <!-- change view -->
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

<style scoped lang="scss">
#StudentView{
 .canvas-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  } 
  .teacher-canvas {
    position: absolute;
    display: flex;
    align-items: center;
    top: 96px;
    right: 8px;
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
}

#TeacherView {
  .side {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 16px;
    padding-top: 96px;
    z-index: 0;
    top: 0;
    right: 0;
    width: fit-content;
    height: 100vh;
    overflow-y: scroll;
    background: var(--buttons-secondary, #D7D7EF);
    border-radius: 16px 0 0 16px;
  
    .student-canvas {
      width: 16*32px;
      height: 9*32px;
  
      border-radius: 8px;
  
      background: var(--background, #E5E6F5);
    }
  }
}
.navbar {
  position: absolute;
  display: flex;
  align-items: center;
  top: 16px;
  right: 48px;
  width: fit-content;
  height: 64px;

  padding: {
    left: 16px;
    right: 16px;
    top: 16px;
    bottom: 8px;
  }

  ;

  justify-content: space-between;
  gap: 16px;
  overflow: hidden;
  border-radius: 8px;
  border: 2px solid var(--accent, #464AB4);
  background: var(--background);
  box-shadow: 2px 4px 4px 0px rgba(0, 0, 0, 0.25);
  flex-shrink: 0;

  * {
    width: 48px;
    height: 48px;

    background-color: transparent;
  }

  img {
    width: 40px;
    height: 40px;
  }
}
</style>