<template>
  <HeaderComponent msg="КРОК ШИР 179dev" />
  <main class="main-content">
    <EmailInputComponent />

    <PasswordComponent />

    <div class="custom">
      <button @click="register()" :class="{ 'button-disabled': !allDataIsValid }">Войти</button>
    </div>

    <div class="custom">
      <RouterLink to="/register">У меня нет аккаунта</RouterLink>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { WritableComputedRef } from 'vue';
import HeaderComponent from '@/components/HeaderComponent.vue';
import EmailInputComponent from '@/components/EmailInputComponent.vue';
import PasswordComponent from '@/components/PasswordInputComponent.vue';

import router from '@/router';


import { storeToRefs } from 'pinia';
import { useUserStore, useFormStateStore } from '@/store';
const userStore = useUserStore();
const formStateStore = useFormStateStore();
const { user, newUser } = storeToRefs(userStore);
const {
  isInteracted,
  emailIsGiven,
  emailIsValid,
  passwordIsGiven
} = storeToRefs(formStateStore);
isInteracted.value = false;
emailIsGiven.value = false;
emailIsValid.value = false;
passwordIsGiven.value = false;

const allDataIsValid: WritableComputedRef<boolean> = computed((): boolean => {
  return emailIsGiven.value && passwordIsGiven.value && emailIsValid.value;
});

function register(): void {
  if (allDataIsValid) {
    user.value = newUser.value
    // TODO: connect to backend server
    router.push('/home')
  };
};
</script>


<style scoped lang="scss">
@import '@/assets/scss/form.scss';
</style>
