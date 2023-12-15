<template>
  <HeaderComponent msg="КРОК ШИР 179dev" />
  <main class="main-content">
    <EmailInputComponent />

    <PasswordComponent with-repeat />

    <div class="custom">
      <button
        :class="{ 'button-disabled': !allDataIsValid }"
        @click="register()"
      >
        Войти
      </button>
    </div>

    <div class="custom">
      <RouterLink to="/log_in">
        У меня есть аккаунт
      </RouterLink>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import type { WritableComputedRef } from "vue";
import { storeToRefs } from "pinia";

import router from "@/router";
import { useUserStore, useFormStateStore } from "@/store";

import HeaderComponent from "@/components/HeaderComponent.vue";
import EmailInputComponent from "@/components/EmailInputComponent.vue";
import PasswordComponent from "@/components/PasswordInputComponent.vue";


const { user, newUser } = storeToRefs(useUserStore());
const {
    isInteracted,
    emailIsGiven,
    emailIsValid,
    passwordIsGiven,
    passwordIsRepeated,
} = storeToRefs(useFormStateStore());
isInteracted.value = false;
emailIsGiven.value = false;
emailIsValid.value = false;
passwordIsGiven.value = false;
passwordIsRepeated.value = false;

const allDataIsValid: WritableComputedRef<boolean> = computed((): boolean => {
    return emailIsGiven.value && passwordIsGiven.value && passwordIsRepeated.value && emailIsValid.value;
});

function register(): void {
    if (allDataIsValid.value) {
        user.value = newUser.value;
        // TODO: connect to backend server
        router.push("/home");
    }
}
</script>


<style scoped lang="scss">
@import '@/assets/scss/form.scss';
</style>
