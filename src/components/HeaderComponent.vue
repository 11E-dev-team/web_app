<template>
  <header class="header">
    <h1>
      <RouterLink :to="homePage">{{ msg }}</RouterLink>
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
  computed: {
    email(): string {
      return user.value ? user.value.email.toString() : 'Not Logged In';
    },
    homePage(): string {
      return user.value ? '/home' : '/';
    },
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
  border-bottom: 1px solid var(--accent, #464ab4);
  background: var(--background, #e5e6f5);
}
</style>
