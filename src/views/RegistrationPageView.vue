<template>
  <HeaderComponent msg="КРОК ШИР 179dev" />
  <main class="main-content">
    <div>
      <p class="title">Почта</p>
      <input type="text" v-model="email" required />
      <p v-show="!emailIsGiven" class="invalidDataError">Введите почту</p>
      <p v-show="!emailIsValid" class="invalidDataError">Почта введена некорректно</p>
    </div>

    <div>
      <p class="title">Пароль</p>
      <input v-model="password" type="password" required />
      <p v-show="!passwordIsGiven" class="invalidDataError">Введите пароль</p>
    </div>

    <div>
      <p class="title">Повторите пароль</p>
      <input v-model="password_repeat" type="password" required />
      <p v-show="!passwordRepeated" class="invalidDataError">Пароли не совпадают</p>
    </div>

    <div>
      <button @click="register()" :class="{ 'button-disabled': !allDataIsValid }">Зарегистрироваться</button>
    </div>

    <div>
      <RouterLink to="/log_in">У меня есть аккаунт</RouterLink>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HeaderComponent from '@/components/HeaderComponent.vue';

import router from '@/router';

import { storeToRefs } from 'pinia';
import { useUserStore, User } from '@/store';
const userStore = useUserStore();
const { user } = storeToRefs(userStore)

export default defineComponent({
  components: {
    HeaderComponent,
  },
  data() {
    return {
      email: '' as string,
      password: '' as string,
      password_repeat: '' as string,
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
    passwordRepeated(): boolean {
      return this.password_repeat == this.password;
    },
    emailIsValid(): boolean {
      return this.email.match(/[\w-\.]+@([\w-]+\.)+[\w-]{2,4}/) ? true : this.email === '';
    },
    allDataIsValid(): boolean {
      return this.emailIsGiven && this.passwordIsGiven && this.passwordRepeated && this.emailIsValid;
    },
  },
  methods: {
    register() {
      if (this.allDataIsValid) {
        user.value = {
          email: this.email as string,
        };
        // TODO: connect to backend server
        router.push('/home')
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
  overflow-y: scroll;
  height: calc(100vh - ($header-height + $common-padding * 2)); /* Subtract the header and footer heights from the viewport height */

  * {
    display: flex;
  }

  div {
    flex-direction: column;
    align-items: center;

    height: 8em;

    * {
      display: flex;
    }

    p {
      margin: 0;
    }

    p.title {
      width: 384px;
      align-items: center;
      justify-content: center;

      font-size: 1.5em;

      margin-bottom: 8px;
    }

    p.invalidDataError {
      font-size: small;
      margin-top: 4px;
    }

    input {
      width: 384px;

      font-size: 1.5em;
    }

    button {
      justify-self: center;
      height: 2.5em;
      width: 384px;
      align-items: center;
      justify-content: center;

      border-radius: 16px;

      font-size: 1.25em;

      color: #ffffff;
      background-color: var(--primary, #6c6fc6);

      box-shadow: 2px 4px 4px 0px rgba(0, 0, 0, 0.25);
    }
  }

  .button-disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}
</style>
