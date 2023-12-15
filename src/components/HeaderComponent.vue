<template>
  <header class="header">
    <RouterLink :to="homePage">
      <img src="@/assets/SpizdIconPack/Logo.svg">
      <span>boardcast</span>
    </RouterLink>
    <span>{{ email }}</span>
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
  computed: {
    email() {
      return user.value ? user.value.email.toString() : 'Not Logged In';
    },
    homePage() {
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

  a {
    display: flex;
    align-items: center;
    align-self: center;
    text-decoration: none;
    
    img {
      width: 2rem;
      height: 2rem;
      margin-right: calc($common-padding / 2);
    }
    span {
      font-weight: 250;
    }
  }
}
</style>
