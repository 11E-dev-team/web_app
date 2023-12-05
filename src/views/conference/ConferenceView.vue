<template>
  <!-- TODO: Write a conference view and logic -->
  <!-- <student-view v-if="isTeacher" />
  <teacher-view v-else /> -->
  <!-- Switch back if else -->
  <teacher-view v-if="isTeacher" />
  <student-view v-else />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { storeToRefs } from 'pinia';

import { useUserStore } from '@/store';
import { Conference } from '@/utils/canvasLogic/Conference';
import StudentView from './StudentView.vue';
import TeacherView from './TeacherView.vue';

const userStore = useUserStore();
const { conferenceId, idInConference } = storeToRefs(userStore);

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
  computed: {
    isTeacher(): boolean {
      const idInConference_ = idInConference.value.find(x => x.conferenceId === this.conferenceId);
      return idInConference_ !== undefined && idInConference_.role !== undefined && idInConference_.role >= 4;
    },
  },
})
</script>
