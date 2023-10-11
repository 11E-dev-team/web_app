<template>
  <HeaderComponent msg="КРОК ШИР 179dev" />
  <main class="main-content">
    <p>Почта</p>
    <input type="text" v-model="email" required />
    <p v-show="!emailIsGiven" class="invalidDataError">Введите почту</p>
    <p v-show="!emailIsValid" class="invalidDataError">Почта введена некорректно</p>
    <p>Пароль</p>
    <input type="password" v-model="password" required />
    <p v-show="!passwordIsGiven" class="invalidDataError">Введите пароль</p>
    <button @click="register()" :class="{ 'button-disabled': !allDataIsValid }">Войти</button>
    <RouterLink to="/register">У меня нет аккаунта</RouterLink>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HeaderComponent from '@/components/HeaderComponent.vue';

import router from '@/router';

import { storeToRefs } from 'pinia';
import { useUserStore, UserRole } from '@/store';
const userStore = useUserStore();
const { user } = storeToRefs(userStore);

export default defineComponent({
  components: {
    HeaderComponent,
  },
  data() {
    return {
      email: '' as string,
      password: '' as string,
    }
  },
  computed: {
    emailIsGiven(): boolean {
      return this.email.length > 0;
    },
    passwordIsGiven(): boolean {
      return this.password.length > 0;
    },
    emailIsValid(): boolean {
      return this.email.match(/[\w-\.]+@([\w-]+\.)+[\w-]{2,4}/) ? true : this.email === '';
    },
    allDataIsValid(): boolean {
      return this.emailIsGiven && this.passwordIsGiven && this.emailIsValid;
    },
  },
  methods: {
    register() {
      if (this.allDataIsValid) {
        user.value = {
          email: this.email as string,
          role: UserRole.none as UserRole,
        };
        // TODO: connect to backend server
        router.push('/');
      };
    },
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

  p.invalidDataError {
    font-size: small;
    margin-top: 4px;
  }

  button {
    margin-top: 16px;
  }
}
</style>
