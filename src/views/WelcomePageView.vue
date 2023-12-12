<template>
  <HeaderComponent msg="КРОК ШИР 179dev" />
  <main class="main-content">
    <button id="create-conference" class="cta-button" @click="createConference">Create Conference</button>
  </main>
  <footer class="footer">
    <RouterLink to="/register" class="cta-button">Register</RouterLink>
    <RouterLink to="/log_in" class="cta-button">Log In</RouterLink>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';

import HeaderComponent from '@/components/HeaderComponent.vue';
import router from '@/router';

export default defineComponent({
  components: {
    HeaderComponent,
  },
  methods: {
    createConference() {
      axios.post('http://0.0.0.0:8179/conference').then((response) => {
        const { conference_id } = response.data;
        router.push(`/conference/${conference_id}`);
      });
    },
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/main.scss';

.main-content {
  flex: 1;
  padding: $common-padding;
  overflow-y: auto;
  overscroll-behavior: contain;
  height: calc(100vh - ($header-height + $common-padding * 2) * 2); /* Subtract the header and footer heights from the viewport height */
}

footer {
  height: $header-height;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: $common-padding;
}

.cta-button {
  color: coral;
  background-color: transparent;
}

footer a + a {
  margin-left: $common-padding;
}
</style>
