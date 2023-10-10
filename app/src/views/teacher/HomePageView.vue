<template>
  <HeaderComponent msg="КРОК ШИР 179dev" />
  <main class="main-content">
    TeacherHomePage
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

<style scoped lang="scss">
@import '@/assets/scss/main.scss';

.main-content {
  flex: 1;
  padding: $common-padding;
  overflow-y: auto;
  overscroll-behavior: contain;
  max-height: calc(100vh - ($header-height + $common-padding * 2) * 2 - $common-padding * 2); /* Subtract the header and footer heights from the viewport height */
}
</style>
