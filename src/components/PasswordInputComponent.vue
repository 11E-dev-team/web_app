<template>
  <div>
    <label v-if="!props.repeat" class="title">Пароль</label>
    <label v-else class="title">Повторите пароль</label>
    <input v-model="password" type="password" @input="isInteracted = true" required />
    <span
      v-if="!props.repeat"
      v-show="!passwordIsGiven && isInteracted"
      class="invalidDataError"
    >Введите пароль</span>
    <span
      v-if="props.repeat"
      v-show="!passwordIsGiven && isInteracted"
      class="invalidDataError"
    >Введите пароль еще раз</span>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, ref, watch } from 'vue';
import type { Ref } from 'vue';

const props = defineProps({
  repeat: Boolean,
})

import { ValueError } from '@/errors';
import Password from '@/utils/password';

import { storeToRefs } from 'pinia';

import { useFormStateStore } from '@/store';
const formStateStore = useFormStateStore();
const {
  isInteracted,
  passwordIsGiven
} = storeToRefs(formStateStore);

let passwordObj: Password | null = null;
const password: Ref<string> = ref('');

watch(password, ( newValue ) => {
  try{
    passwordObj = new Password(newValue);
    passwordIsGiven.value = true;
  } catch (e) {
    passwordObj = null;
    if (e instanceof ValueError) {
      passwordIsGiven.value = false;
    } else {
      throw e;
    };
  };
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/form_input.scss';
</style>
