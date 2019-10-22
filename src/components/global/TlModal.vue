<template>
    <modal height="auto" scrollable :name="name" 
        @closed="closed()" @before-close="beforeClose()" 
        @opened="opened()" @before-open="beforeOpen()"
        :width="width"
        :clickToClose="clickToClose"
        >
        <div class="main-modal">
            <div class="text-right close-btn">
                <icon name="close-circle pointer" @click.native="hide()" />
            </div>
            <slot></slot>
        </div>
    </modal>
</template>

<script>
export default {
    props: {
        name: {
            type: String,
            required: true,
        },
        width: {
            type: String,
            default: '350px'
        },
        clickToClose: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        show() {
            this.$modal.show(this.name);
        },
        hide() {
            this.$modal.hide(this.name);
        },
        opened(){
            this.$emit("opened");
        },
        beforeOpen(){
            this.$emit("beforeOpen");
        },
        closed(){
            this.$emit("closed");
        },
        beforeClose(){
            this.$emit("beforeClose");
        },
    }
}
</script>

<style lang="scss">

.main-modal{
    padding: $basePx $basePx;
    padding-bottom: $basePx*4;
    .close-btn{
        padding-bottom: $basePx*2;
    }
}
</style>