<template>
  <div class="input">
    <select
      v-model="myValue"
      class="input-field"
      :value="value"
      required
      :placeholder="placeholder"
    >
      <option
        v-for="(option, index) in options"
        :key="index"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    <label v-if="label" class="input-label">{{ label }}</label>
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
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    options: {
      type: [Array(String)],
      default: [],
    },
  },
  data() {
    return {
      myValue: this.value,
    };
  },
  watch: {
    myValue(v) {
      this.$emit('input', v);
    },
    value(v) {
      this.myValue = v;
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

  & + .input {
    margin-top: 1.5rem;
  }

  &-label {
    color: #8597a3;
    position: absolute;
    top: 1.8rem;
    font-size: 0.8rem;
    transform: translateY(0);
    // opacity: 1;
    font-weight: 700;
    transition: all 0.3s ease;
    opacity: 0;
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

    &:placeholder-shown {
      & + .input-label {
        opacity: 0;
      }
    }

    &:focus,
    &:not(:placeholder-shown) {
      & + .input-label {
        opacity: 1 !important;
        transform: translateY(-1.6rem) !important;
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
