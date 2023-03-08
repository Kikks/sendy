<template>
  <div class="iframe-container">
    <iframe ref="myIframe" :src="authorizationUrl"></iframe>

    <button class="close-button" @click="$emit('onClose')">
      <icon name="close" color="white" />
    </button>
  </div>
</template>

<script>
export default {
  props: {
    authorizationUrl: {
      type: [Boolean, String],
      default: false,
    },
  },
  mounted() {
    const iframe = this.$refs.myIframe;
    const handleUrlChange = () => {
      const newUrl = iframe.contentWindow.location.href;

      if (newUrl !== iframe.src) {
        this.$$emit('handlePaymentComplete');
      }
    };
    iframe.addEventListener('load', handleUrlChange);
    this.$once('hook:beforeDestroy', () => {
      iframe.removeEventListener('load', handleUrlChange);
    });
  },
};
</script>

<style lang="scss" scoped>
.iframe-container {
  position: fixed;
  height: 100vh;
  width: 100vw;
  background: rgba($color: #000000, $alpha: 0.8);
  z-index: 99999999999999;

  & iframe {
    height: 100%;
    width: 100%;
  }

  & .close-button {
    position: absolute;
    top: 2%;
    right: 2%;
    height: 2.5rem;
    width: 2.5rem;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background-color: red;
  }
}
</style>
