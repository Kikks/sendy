<template>
  <modal
    scrollable
    adaptive
    :height="height"
    :name="name"
    :width="width"
    :click-to-close="clickToClose"
    :max-width="maxWidth"
    @closed="closed()"
    @before-close="beforeClose()"
    @opened="opened()"
    @before-open="beforeOpen()"
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
      default: '350px',
    },
    height: {
      type: String,
      default: 'auto',
    },
    clickToClose: {
      type: Boolean,
      default: true,
    },
    maxWidth: {
      type: Number,
      default: 500,
    },
  },
  methods: {
    show() {
      this.$modal.show(this.name);
    },
    hide() {
      this.$modal.hide(this.name);
    },
    opened() {
      this.$emit('opened');
    },
    beforeOpen() {
      this.$emit('beforeOpen');
    },
    closed() {
      this.$emit('closed');
    },
    beforeClose() {
      this.$emit('beforeClose');
    },
  },
};
</script>

<style lang="scss">
.v--modal-overlay {
  z-index: 99933333;
}
.main-modal {
  padding: $basePx $basePx;
  padding-bottom: $basePx * 4;
  .close-btn {
    padding-bottom: $basePx * 2;
  }
}
</style>
