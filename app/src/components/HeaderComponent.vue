<template>
  <header class="header">
    <h1>
      <RouterLink to="/">{{ msg }}</RouterLink>
    </h1>
    <userInfo>{{ email }}</userInfo>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store';
const userStore = useUserStore();
const { user } = storeToRefs(userStore)

export default defineComponent({
  name: 'HeaderComponent',
  props: {
    msg: String,
  },
  methods: {
    goToProfile() {
      // Logic to navigate to the profile screen
    },
  },
  computed: {
    email() {
      return user.value ? user.value.email : 'Not Logged In';
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '@/assets/scss/main.scss';

.header {
  height: $header-height;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $common-padding;
  background-color: #f2f2f2;
}

.go-to-profile {
  /* Add styles for the "Go to Profile" button */
}
</style>
