<template>
  <div
    class="d-flex align-items-center flex-row justify-content-end pagination"
  >
    <span>{{ page }} of {{ pageCount }}</span>
    <div class="ml-2">
      <span @click="prevData">
        <icon name="chevron-left-circle" size="1.4" primary class="pointer" />
      </span>
      <span @click="nextData">
        <icon name="chevron-right-circle" size="1.4" primary class="pointer" />
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    pageCount: {
      type: Number,
      default: 0,
    },
    page: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    prevData() {
      this.$emit('prevData');
    },
    nextData() {
      this.$emit('nextData');
    },
  },
};
</script>
<style lang="scss" scoped>
.pagination {
  span {
    font-size: 14px;
  }
}
</style>
