<template>
  <HeaderComponent />
  <main class="main-content">
    It's a log in page
  </main>
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
</style>