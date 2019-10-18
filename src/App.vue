<template>
  <div id="app">
      <keep-alive>
        <router-view/>
      </keep-alive>
  </div>
</template>

<style lang="scss" scoped>
#app{
    // border: 1px solid red;
    background-color: white;
    max-width: 500px;
    margin: auto;
    min-height: 100vh;
}
</style>
