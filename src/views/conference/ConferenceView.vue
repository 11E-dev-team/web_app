<template>
  <!-- TODO: Write a conference view and logic -->
  <teacher-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { storeToRefs } from 'pinia';

import { useUserStore } from '@/store';
import { Conference } from '@/utils/canvasLogic/Conference';
import StudentView from './StudentView.vue';
import TeacherView from './TeacherView.vue';

const userStore = useUserStore();
const { conferenceId } = storeToRefs(userStore);

export default defineComponent({
  name: 'ConferenceView',
  components: {
    StudentView,
    TeacherView,
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
