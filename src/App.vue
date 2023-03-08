<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss" scoped>
#app {
  // border: 1px solid red;
  background-color: white;
  margin: auto;
  min-height: 100vh;

  @media (min-width: 768px) {
    margin: 0;
    min-height: 100vh;
    height: 100%;
    width: 100%;
  }
}
</style>
