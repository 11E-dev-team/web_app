<template>
  <!-- TODO: Write a conference view and logic -->
  <span>You're in {{ conferenceId }} conference</span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ConferenceView',
  data() {
    return {
      conferenceId: this.$route.params["id"]
    }
  }
})
</script>
