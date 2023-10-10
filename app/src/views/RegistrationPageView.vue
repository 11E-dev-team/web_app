<template>
  <HeaderComponent msg="КРОК ШИР 179dev" />
  <main class="main-content">
    <div>
      <input type="radio" v-model="role" value="student" id="student" checked />
      <label for="student">Студент</label>
      <input type="radio" v-model="role" value="teacher" id="teacher" />
      <label for="teacher">Преподаватель</label>
    </div>
    <p>Почта</p>
    <input v-model="email" />
    <p>Пароль</p>
    <input v-model="password" type="password" />
    <button>Зарегистрироваться</button>
    <RouterLink to="/log_in" class="to-bottom">У меня есть аккаунт</RouterLink>
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
      role: 'student',
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
  max-height: calc(100vh - ($header-height + $common-padding * 2)); /* Subtract the header and footer heights from the viewport height */

  * {
    display: flex;
  }
}

input ~ input {
  margin-left: $common-padding;
}
</style>
