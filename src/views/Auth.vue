<template>
  <div class="auth-container">
    <div class="blue-back"></div>

    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'auth',
};
</script>

<style lang="scss" scoped>
.auth-container {
  @media (min-width: 768px) {
    position: relative;
    min-height: 100vh;
    width: 100%;
    display: grid;
    place-items: center;
    padding: 5rem 0;
  }
}

.blue-back {
  position: absolute;
  background-color: $primary;
  min-height: 40vh;
  width: 100%;
  max-width: $full-width;
  z-index: 1;
  top: 0;

  @media (min-width: 768px) {
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    max-width: none;
  }
}
.content {
  position: relative;
  z-index: 2;

  @media (min-width: 768px) {
    max-width: 600px;
    width: 100%;
    margin: 0 auto;
  }
}
</style>
