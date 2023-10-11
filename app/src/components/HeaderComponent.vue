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
import { useUserStore, UserRole } from '@/store';
const userStore = useUserStore();
const { user } = storeToRefs(userStore)

export default defineComponent({
  name: 'HeaderComponent',
  props: {
    msg: String,
  },
  computed: {
    email(): string {
      return user.value ? user.value.email : 'Not Logged In';
    },
    homePage(): string {
      switch (user.value ? user.value.role : null) {
        case UserRole.student: return '/student'; break;
        case UserRole.teacher: return '/teacher'; break;
        default: return '/';
      };
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
  background-color: #f2f2f2;
}
</style>
