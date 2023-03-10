<template>
  <div class="input">
    <input
      v-model="myValue"
      class="input-field"
      :class="type === 'password' ? 'input-field-padded' : ''"
      :value="value"
      required
      :type="typeToShow"
      :placeholder="placeholder"
    />
    <label v-if="label" class="input-label">{{ label }}</label>
    <button
      v-if="type == 'password'"
      class="input-button"
      @click="togglePasswordVisible()"
    >
      <icon
        :name="!passwordVisible ? 'eye-outline' : 'eye-off-outline'"
        size="1.2"
      />
    </button>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: [Boolean, String],
      default: false,
    },
    icon: {
      type: [Boolean, String],
      default: false,
    },
    iconSize: {
      type: String,
      default: '1.2',
    },
    type: {
      type: String,
      default: 'text',
    },
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      myValue: this.value,
      passwordVisible: false,
    };
  },
  computed: {
    typeToShow() {
      if (this.type === 'password' && this.passwordVisible) {
        return 'text';
      }

      return this.type;
    },
  },
  watch: {
    myValue(v) {
      this.$emit('input', v);
    },
    value(v) {
      this.myValue = v;
    },
  },
  methods: {
    togglePasswordVisible() {
      this.passwordVisible = !this.passwordVisible;
    },
  },
};
</script>

<style lang="scss" scoped>
// iOS Reset
.input {
  appearance: none;
  border-radius: 0;
  display: flex;
  flex-direction: column-reverse;
  position: relative;
  padding-top: 1.5rem;
  font-size: 1rem;
  width: 100%;

  & + .input {
    margin-top: 1rem;
  }

  &-content {
    position: relative;
    width: 100%;
    flex: 1;
    display: flex;
    margin: 0;
    padding: 0;
  }

  &-label {
    color: #8597a3;
    position: absolute;
    top: 1.8rem;
    font-size: 0.8rem;
    transform: translateY(0);
    opacity: 1;
    font-weight: 700;
    transition: all 0.3s ease;
    opacity: 0;
  }

  &-button {
    height: 2rem;
    width: 2rem;
    position: absolute;
    right: 0;
    bottom: 0;
    transform: translate(0, 0);
    z-index: 20;
  }

  &-field {
    border: 0;
    outline: 0;
    z-index: 1;
    background-color: transparent;
    border-bottom: 2px solid #eee;
    font: inherit;
    font-size: 1rem;
    padding: 0.25rem 0;
    transition: all 0.3s ease;
    flex: 1;

    &-padded {
      padding-right: 2rem;
    }

    &:placeholder-shown {
      & + .input-label {
        opacity: 0;
      }
    }

    &:focus,
    &:not(:placeholder-shown) {
      & + .input-label {
        opacity: 1;
        transform: translateY(-1.6rem);
      }
    }

    &:focus {
      border-bottom-color: $primary;

      & + .input-label {
        color: $primary;
      }
    }
  }
}
</style>
