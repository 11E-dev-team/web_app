<template>
  <div>
    <label class="title">Пароль</label>
    <input
      v-model="_password"
      type="password"
      required
      @input="isInteracted = true"
    >
    <span
      v-show="!passwordIsGiven && isInteracted"
      class="invalidDataError"
    >Введите пароль</span>
  </div>
  <!-- Drawing an additional input for repeated password if needed -->
  <div v-if="props.withRepeat">
    <label class="title">Повторите пароль</label>
    <input
      v-model="_passwordRepeat"
      type="password"
      required
      @input="isInteracted = true"
    >
    <span
      v-show="!passwordIsRepeated && isInteracted"
      class="invalidDataError"
    >Введите пароль еще раз</span>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, watch, Ref } from 'vue';

const props = defineProps({
  withRepeat: Boolean,
})

import { ValueError } from '@/errors';
import Password from '@/utils/password';

import { storeToRefs } from 'pinia';

import { useFormStateStore, useAuthorizationStore } from '@/store';
const formStateStore = useFormStateStore();
const authorizationStore = useAuthorizationStore();
const {
  isInteracted,
  passwordIsGiven,
  passwordIsRepeated,
} = storeToRefs(formStateStore);
const { password, passwordRepeat } = storeToRefs(authorizationStore)

const _password = ref<string>('');
const _passwordRepeat = ref<string>('');

watch(_password, ( newValue ) => {
  try{
    password.value = new Password(newValue);
    passwordIsGiven.value = true;
  } catch (e) {
    password.value = null;
    if (e instanceof ValueError) {
      passwordIsGiven.value = false;
      passwordIsRepeated.value = false;
    } else {
      throw e;
    };
  };
});

watch(_passwordRepeat, ( newValue ) => {
  try{
    passwordRepeat.value = new Password(newValue);
    passwordIsRepeated.value = password.value == newValue;
  } catch (e) {
    passwordRepeat.value = null;
    if (e instanceof ValueError) {
      passwordIsRepeated.value = false;
    } else {
      throw e;
    };
  };
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/form_input.scss';
</style>
