<template>
  <div class="floating-tab">
    <div class="tabs">
      <router-link
        :to="{ name: 'home' }"
        tag="div"
        class="tab"
        exact-active-class="active"
      >
        <icon name="home" />
        <div class="text">Home</div>
      </router-link>
      <router-link
        :to="{ name: 'topup' }"
        tag="div"
        class="tab"
        active-class="active"
      >
        <icon name="trending-up" />
        <div class="text">Top up</div>
      </router-link>
      <router-link
        :to="{ name: 'contacts' }"
        tag="div"
        class="tab"
        active-class="active"
      >
        <icon name="account-circle-outline" />
        <div class="text">Contacts</div>
      </router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.floating-tab {
  // border: 1px solid red;
  position: fixed;
  width: 100%;
  margin: auto;
  min-height: 60px;
  bottom: 10px;
  text-align: center;
  // max-width: $full-width;

  @media (min-width: 1024px) {
    display: none;
  }

  .tabs {
    margin: auto;
    width: 92%;
    // border: 1px solid blue;
    // min-height: 60px;
    border-radius: 10px;
    background-color: white;
    box-shadow: 0px 20px 80px #e5e5e5;

    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 25px;
    padding-top: 10px;
    .tab {
      cursor: pointer;
      padding: 0px 5px 7px 5px;
      border-bottom: 4px solid white;
      .text {
        font-size: 12px;
        color: #ababb9;
        font-weight: bold;
      }
      .mdi {
        color: #ababb9;
      }

      &.active {
        border-bottom-color: $primary;
        .text {
          color: $primary;
        }
        .mdi {
          color: $primary;
        }
      }
    }
  }
}
</style>
