<template>
    <nav class="navbar">
        
        <img src="../assets/white-logo.svg" />
        <img src="../assets/images/menu.svg" />
    </nav>
</template>

<style lang="scss" scoped>
    nav.navbar{
        background-color: $accent;
        padding: 15px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: fixed;
        width: 100%;

        img{
            height: 20px;
        }
    }
</style>