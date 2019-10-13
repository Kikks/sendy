<template>
    <div>
        <div class="blue-back"></div>

        <div class="content">
            <router-view />
        </div>
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
    min-height: 40vh;
    width: 100%;
    max-width: $full-width;
    z-index: 1;
    top: 0;
}
.content{
    position: relative;
    z-index: 2;
}
</style>