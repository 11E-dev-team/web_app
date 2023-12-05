<template>
  <!-- TODO: Write a conference view and logic -->
  <!-- <teachers-view v-if="isTeacher" /> -->
  <teacher-view v-if=false />
  <!-- <student-view v-else /> -->
  <student-view2 v-else />
  <!-- Switch back if else -->
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { storeToRefs } from 'pinia';

import { useUserStore } from '@/store';
import { Conference } from '@/utils/canvasLogic/Conference';
import StudentView from './StudentView.vue';
import TeacherView from './TeacherView.vue';
import StudentView2 from './StudentView2.vue';

const userStore = useUserStore();
const { conferenceId, idInConference } = storeToRefs(userStore);

export default defineComponent({
  name: 'ConferenceView',
  components: {
    StudentView,
    TeacherView,
    StudentView2
  },
  // data() {
  //   conferenceId.value = this.$route.params["id"] as string;
  //   let conference: Conference | undefined;
  //   return {
  //     conferenceId,
  //     conference,
  //   }
  // },
  // mounted() {
  //   this.conference = new Conference(this.conferenceId);
  // },
  // unmounted() {
  //   this.conference?.leave();
  // },
  // computed: {
  //   isTeacher(): boolean {
  //     const idInConference_ = idInConference.value.find(x => x.conferenceId === this.conferenceId);
  //     return idInConference_ !== undefined && idInConference_.role !== undefined && idInConference_.role >= 4;
  //   },
  // },
})
</script>
