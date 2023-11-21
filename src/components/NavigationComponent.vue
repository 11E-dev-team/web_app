<template>
  <div class="navbar">
    <button></button> <!-- home -->
    <button></button> <!-- settings -->
    <button></button> <!-- group preview -->
    <button></button> <!-- change view -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'NavigationBar',
})
</script>

<style scoped lang="scss">
@import '@/assets/scss/main.scss';
.navbar {
  position: absolute;
  display: flex;
  top: 16px;
  right: 16px;
  width: fit-content;
  padding: 16px;
  gap: 16px;
  overflow: hidden;
  border-radius: 16px;
  border: 2px solid var(--accent, #464AB4);
  background: var(--background, #E5E6F5);
  box-shadow: 2px 4px 4px 0px rgba(0, 0, 0, 0.25);
  flex-shrink: 0;

  button {
    width: 48px;
    height: 48px;
    
    background-color: #464AB4;
  }
}
</style>
