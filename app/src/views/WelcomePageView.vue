<template>
  <HeaderComponent />
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

<style scoped>
.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  overscroll-behavior: contain;
  max-height: calc(100vh - 100px - 100px - 40px); /* Subtract the header and footer heights from the viewport height */
}

.scrollable-container {
  /* Add styles for the scrollable container */
}

footer {
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #f2f2f2;
}

.cta-button {
  text-decoration: none;
  color: coral;
}

footer a + a {
  margin-left: 20px;
}
</style>