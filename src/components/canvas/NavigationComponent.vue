<template>
  <div class="navbar">
    <RouterLink to="/">
      <img src="@/assets/SpizdIconPack/exit.svg" alt="logo">
    </RouterLink> <!-- home -->
    <button>
      <img src="@/assets/SpizdIconPack/settingsIcon.svg" alt="logo">
    </button> <!-- settings -->
    <button>
      <img src="@/assets/SpizdIconPack/groupIcon.svg" alt="logo">
    </button> <!-- group preview -->
    <button>
      <img src="@/assets/SpizdIconPack/desksIcon.svg" alt="logo">
    </button> <!-- change view -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'NavigationBar',
  props: {
    adaptive: Boolean,
  },
  computed: {
    navbarRight () {
      return this.adaptive ? 'calc(15vw - 138px)' : '16px';
    },
  }
})
</script>

<style scoped lang="scss">
@import '@/assets/scss/main.scss';
.navbar {
  position: absolute;
  display: flex;
  top: 16px;
  right: v-bind(navbarRight);
  width: 276px;
  padding: 16px;
  justify-content: space-between;
  gap: 16px;
  overflow: hidden;
  border-radius: 16px;
  border: 2px solid var(--accent, #464AB4);
  background: var(--background, #E5E6F5);
  box-shadow: 2px 4px 4px 0px rgba(0, 0, 0, 0.25);
  flex-shrink: 0;

  * {
    width: 48px;
    height: 48px;
    
    background-color: transparent;
  }
}
</style>
