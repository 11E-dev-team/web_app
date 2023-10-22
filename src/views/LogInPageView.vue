<template>
  <HeaderComponent msg="КРОК ШИР 179dev" />
  <main class="main-content">
    <div>
      <p class="title">Почта</p>
      <input type="email" v-model="email" @input="isInteractioned = true" required autofocus />
      <p v-show="!emailIsGiven && isInteractioned" class="invalidDataError">Введите почту</p>
      <p v-show="!emailIsValid && isInteractioned" class="invalidDataError">Почта введена некорректно</p>
    </div>

    <div>
      <p class="title">Пароль</p>
      <input v-model="password" type="password" @input="isInteractioned = true" required />
      <p v-show="!passwordIsGiven && isInteractioned" class="invalidDataError">Введите пароль</p>
    </div>

    <div class="custom">
      <button @click="register()" :class="{ 'button-disabled': !allDataIsValid }">Войти</button>
    </div>

    <div class="custom">
      <RouterLink to="/register">У меня нет аккаунта</RouterLink>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import type { Ref, WritableComputedRef } from 'vue';
import HeaderComponent from '@/components/HeaderComponent.vue';

import router from '@/router';

import { ValueError, ValidationError } from '@/errors';
import Email from '@/utils/email';
import Password from '@/utils/password';

import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store';
const userStore = useUserStore();
const { user } = storeToRefs(userStore);

let emailObj: Email | null = null;
const email: Ref<string> = ref('');
let passwordObj: Password | null = null;
const password: Ref<string> = ref('');
const isInteractioned: Ref<boolean> = ref(false);
const emailIsGiven: Ref<boolean> = ref(false);
const passwordIsGiven: Ref<boolean> = ref(false);
const emailIsValid: Ref<boolean> = ref(false);

watch(email, ( newValue ) => {
  try{
    emailObj = new Email(newValue);
    emailIsGiven.value = true;
    emailIsValid.value = true;
  } catch (e) {
    emailObj = null;
    if (e instanceof ValueError) {
      emailIsGiven.value = false;
    } else if (e instanceof ValidationError) {
      emailIsGiven.value = true;
      emailIsValid.value = false;
    } else {
      throw e;
    };
  };
});

watch(password, ( newValue ) => {
  try{
    passwordObj = new Password(newValue);
    passwordIsGiven.value = true;
  } catch (e) {
    emailObj = null;
    if (e instanceof ValueError) {
      passwordIsGiven.value = false;
    } else {
      throw e;
    };
  };
});

const allDataIsValid: WritableComputedRef<boolean> = computed((): boolean => {
  return emailIsGiven.value && passwordIsGiven.value && emailIsValid.value;
});

function register(): void {
  if (allDataIsValid) {
    user.value = {
      email: emailObj !== null ? emailObj.toString() as string : '',
    };
    // TODO: connect to backend server
    router.push('/home')
  };
};
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

  div.custom {
    height: auto;

    a {
      margin-top: 2em;
    }
  }

  .button-disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}
</style>
