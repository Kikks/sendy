<template>
  <span
    class="mdi"
    :class="cssClass"
    :style="{ 'font-size': size + 'rem', color: color }"
  ></span>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    spin: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: '',
    },
    size: {
      type: [String, Number],
      default: '1.2',
    },
    primary: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    cssClass() {
      return {
        ['mdi-' + this.name]: true,
        'mdi-spin': this.spin,
        primary: this.primary,
      };
    },
  },
};
</script>
