<template>
  <div>
    <label>Почта</label>
    <input type="email" v-model="email" @input="isInteracted = true" required autofocus />
    <span v-show="!emailIsGiven && isInteracted" class="invalidDataError">Введите почту</span>
    <span v-show="!emailIsValid && isInteracted && emailIsGiven" class="invalidDataError">Почта введена некорректно</span>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import type { Ref } from 'vue';

import { ValueError, ValidationError } from '@/errors';
import Email from '@/utils/email';

import { storeToRefs } from 'pinia';

import { useFormStateStore, useUserStore } from '@/store';
const formStateStore = useFormStateStore();
const userStore = useUserStore();
const {
  isInteracted,
  emailIsGiven,
  emailIsValid,
} = storeToRefs(formStateStore);
const { newUser } = storeToRefs(userStore);

const email: Ref<string> = ref('');

watch(email, ( newValue ) => {
  try{
    newUser.value = {
      email: new Email(newValue) as Email,
    };
    emailIsGiven.value = true;
    emailIsValid.value = true;
  } catch (e) {
    newUser.value = null;
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
</script>

<style scoped lang="scss">
@import '@/assets/scss/form_input.scss';
</style>
