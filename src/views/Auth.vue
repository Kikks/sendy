<template>
<div>
    <div class="blue-back"></div>

	<router-view />
</div>
</template>

<script>

export default {
  name: 'auth',
}
</script>

<style lang="scss" scoped>
.blue-back{
    position: absolute;
    background-color: $primary;
    min-height: 45vh;
    width: 100%;
    z-index: -1;
    top: 0;
}
</style>