<template>
  <HeaderComponent msg="КРОК ШИР 179dev" />
  <main class="main-content">
    <p>Почта</p>
    <input v-model="email" />
    <p>Пароль</p>
    <input v-model="password" type="password" />
    <button>Войти</button>
    <RouterLink to="/register">У меня нет аккаунта</RouterLink>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import HeaderComponent from '@/components/HeaderComponent.vue';

export default defineComponent({
  components: {
    HeaderComponent,
  },
  data() {
    return {
      email: '',
      password: '',
    };
  },
});
</script>


<style scoped lang="scss">
@import '@/assets/scss/main.scss';

.main-content {
  display: flex;
  flex: 1;
  padding: $common-padding;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  overscroll-behavior: contain;
  height: calc(100vh - ($header-height + $common-padding * 2) * 2 - $common-padding * 2); /* Subtract the header and footer heights from the viewport height */

  * {
    display: flex;
  }
}
</style>
