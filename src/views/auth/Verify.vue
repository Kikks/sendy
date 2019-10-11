<template>
	<div class="verify px-4">
        <div class="verify-top text-center">
            Please type the verification code sent to <span style="font-weight:bold">+234808***1500</span>
        </div>
        <div class="card-holder elevate">
            <div class="mb-4">
                <h1>Enter your Verification code</h1>
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
      goBack(){
          this.$router.push({name:"signup"});
      },
      gotoNext(){
          this.$router.push({name:"register-name"});
      }
  }
}
</script>

<style lang="scss" scoped>
.verify{
    .card-holder{
        border-radius: 10px;
        background-color: white;
        padding: 50px 30px;
        margin-top: 50px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .verify-top{
        margin-top: 100px;
        color:white;
    }
}
</style>