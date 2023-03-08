<template>
  <div class="verify px-4">
    <div class="verify-top">
      <div class="row align-items-center">
        <div class="col-2">
          <div>
            <icon name="cellphone"></icon>
          </div>
        </div>
        <div class="col-10">
          Please type the verification code sent to
          <span style="font-weight: bold">+234808***1500</span>
        </div>
      </div>
    </div>
    <div class="card-holder elevate">
      <div class="mb-4">
        <h1>Enter your verification code</h1>
      </div>

      <tl-input type="number" class="mb-5" />

      <div class="row align-items-center">
        <div class="col-6 text-left">
          <button @click="goBack()">Resend</button>
        </div>

        <div class="col-6 text-right">
          <button class="round-btn" @click="gotoNext()">
            <icon name="arrow-right" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'verify',
  methods: {
    goBack() {
      this.$router.push({ name: 'signup' });
    },
    gotoNext() {
      this.$router.push({ name: 'register-name' });
    },
  },
};
</script>

<style lang="scss" scoped>
.verify {
  @media (min-width: 768px) {
    width: 100%;
  }

  .card-holder {
    border-radius: 10px;
    background-color: white;
    padding: 50px 30px;
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    @media (min-width: 768px) {
      margin-top: 0;
      width: 100%;
    }
  }
  .verify-top {
    margin-top: 100px;
    color: white;

    @media (min-width: 768px) {
      margin-top: 0;
      margin-bottom: 2rem;
    }
  }
}
</style>
