<template>
  <div class="home px-4">
    <div>
      <img alt="Vue logo" src="../assets/help.png" />
    </div>
    <h3>
      <b>Contact Us</b>
    </h3>
    <p>Having issues, want to ask a question or just want to say hey? We're waiting to hear from you.</p>

    <div class="row">
      <div class="col-12">
        <a :href="`tel:+2348120789740`">
          <button class="btn">Call Us</button>
        </a>
        <br />
        <br />
        <a :href="`mailto:hello@tinylabs.app`" target="_blank">
          <button class="btn">Email Us</button>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "help"
};
</script>

<style lang="scss" scoped>
.home {
  // border: 1px solid red;
  text-align: center;
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
</style>