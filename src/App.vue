<template>
  <router-view/>
</template>

<style lang="scss">
@import '@/assets/scss/main.scss';

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow: hidden;
  background-color: var(--background, #e5e6f5);
}

a {
  text-decoration: underline var(--secondary, #d7d7ef);
  color: black;
}

body {
  margin: 0;
  font-family: $font-family;
  font-weight: 200;
}

input {
  background-color: transparent;
  border: none;
  border-bottom: 4px solid var(--buttons-secondary, #D7D7EF);
  opacity: 0.8;
}
</style>
