<template>
  <HeaderComponent msg="КРОК ШИР 179dev" />
  <main class="main-content">
    <div class="scrollable-container">
      <p>This is the body of the home screen.</p>
      <p>Feel free to add any content you want here!</p>
    </div>
  </main>
  <footer class="footer">
    <RouterLink to="/register" class="cta-button">Register</RouterLink>
    <RouterLink to="/log_in" class="cta-button">Log In</RouterLink>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import HeaderComponent from '@/components/HeaderComponent.vue';

export default defineComponent({
  components: {
    HeaderComponent,
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
  height: calc(100vh - ($header-height + $common-padding * 2) * 2 - $common-padding * 2); /* Subtract the header and footer heights from the viewport height */
}

.scrollable-container {
  /* Add styles for the scrollable container */
}

footer {
  height: $header-height;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: $common-padding;
  background-color: #f2f2f2;
}

.cta-button {
  color: coral;
}

footer a + a {
  margin-left: $common-padding;
}
</style>
