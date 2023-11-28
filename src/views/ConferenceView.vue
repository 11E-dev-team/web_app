<template>
  <!-- TODO: Write a conference view and logic -->
  <span>You're in {{ conferenceId }} conference</span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { storeToRefs } from 'pinia';

import { useUserStore } from '@/store';
const userStore = useUserStore();
const { conferenceId, mainSocket } = storeToRefs(userStore);

export default defineComponent({
  name: 'ConferenceView',
  data() {
    conferenceId.value = this.$route.params["id"] as string;
    return {
      conferenceId,
    }
  },
  mounted() {
    mainSocket.value = new WebSocket(`ws://0.0.0.0:8179/ws/canvas/${this.conferenceId}`);
  },
})
</script>
