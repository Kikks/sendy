<template>
  <div class="nav-container">
    <nav class="navbar">
      <div class="leading">
        <slot name="leading">
          <button class="p-0" @click="pop()">
            <icon name="chevron-left" size="1" />
            <span>Back</span>
          </button>
        </slot>
      </div>
      <h2 class="title">{{ title }}</h2>
      <div class="trailing text-right">
        <slot name="trailing"></slot>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  methods: {
    pop() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
.nav-container {
  width: 100%;
  //   max-width: $full-width;
}
nav.navbar {
  position: fixed;
  top: 0;
  background-color: $accent;
  padding: 15px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  //   max-width: $full-width;
  z-index: 100;

  .title {
    text-align: center;
    flex: 1;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 1rem;

    @media (min-width: 768px) {
      margin-left: 1rem;
    }
  }

  img {
    height: 20px;
  }

  .leading,
  .trailing {
    width: 100px;

    button {
      color: $primary;
      font-weight: normal;
    }

    @media (min-width: 768px) {
      width: auto;
    }
    // border: 1px solid red;
  }
}

@media (min-width: 1024px) {
  .nav-container {
    padding: 0 20px !important;
    padding-top: 20px !important;
  }
  .navbar {
    background-color: #fff !important;
    padding: 1rem 0 !important;
    border-bottom: solid 1px rgba($color: #000000, $alpha: 0.1);
    box-sizing: border-box;
    position: static !important;
  }

  .title {
    font-size: 1.5rem !important;
    margin-right: auto;
    text-align: left !important;
  }
}
</style>
