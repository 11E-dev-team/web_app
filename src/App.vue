<template>
  <router-view/>
</template>

<style lang="scss">
@import '@/assets/scss/main.scss';

#app {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - $common-padding);
  overflow: hidden;
}

a {
  text-decoration: none;
  color: black;
}
</style>
