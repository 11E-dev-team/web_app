<template>
  <HeaderComponent msg="КРОК ШИР 179dev" />
  <main class="main-content">
    <div>
      <input type="radio" v-model="role" value="{{ UserRole.student }}" id="student" checked />
      <label for="student">Студент</label>
      <input type="radio" v-model="role" value="{{ UserRole.teacher }}" id="teacher" />
      <label for="teacher">Преподаватель</label>
    </div>

    <p>Почта</p>
    <input type="text" v-model="email" required />
    <p v-show="!emailIsGiven" class="invalidDataError">Введите почту</p>
    <p v-show="!emailIsValid" class="invalidDataError">Почта введена некорректно</p>

    <p>Пароль</p>
    <input v-model="password" type="password" required />
    <p v-show="!passwordIsGiven" class="invalidDataError">Введите пароль</p>

    <button @click="register()" :class="{ 'button-disabled': !allDataIsValid }">Зарегистрироваться</button>

    <RouterLink to="/log_in" class="to-bottom">У меня есть аккаунт</RouterLink>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HeaderComponent from '@/components/HeaderComponent.vue';

import router from '@/router';

import { storeToRefs } from 'pinia';
import { useUserStore, UserRole, User } from '@/store';
const userStore = useUserStore();
const { user } = storeToRefs(userStore)

export default defineComponent({
  components: {
    HeaderComponent,
  },
  data() {
    return {
      role: UserRole.student as UserRole,
      email: '' as string,
      password: '' as string,
      user: user.value as User | null,
    };
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
          role: this.role as UserRole,
        };
        // TODO: connect to backend server
        switch (user.value.role) {
          case UserRole.student: router.push('/student'); break;
          case UserRole.teacher: router.push('/teacher'); break;
          default: router.push('/');
        };
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
  height: calc(100vh - ($header-height + $common-padding * 2)); /* Subtract the header and footer heights from the viewport height */

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

  .button-disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}

input ~ input {
  margin-left: $common-padding;
}
</style>
