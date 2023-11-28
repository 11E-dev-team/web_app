<template>
  <!-- TODO: Write a conference view and logic -->
  <span>You're in {{ conferenceId }} conference</span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { storeToRefs } from 'pinia';

import { useUserStore } from '@/store';
import { setWebSocket } from '@/utils/canvasLogic/websocket';

const userStore = useUserStore();
const { conferenceId } = storeToRefs(userStore);

export default defineComponent({
  name: 'ConferenceView',
  data() {
    conferenceId.value = this.$route.params["id"] as string;
    return {
      conferenceId,
    }
  },
  mounted() {
    setWebSocket(this.conferenceId);
  },
})
</script>
