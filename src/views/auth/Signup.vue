<template>
	<div class="signup px-4">
        <div class="card-holder elevate">
            <div>
                <h1>Enter your phone number</h1>
            </div>

           <tl-input label="Phone"/>

            <div class="text-right">
                <button class="round-btn" @click="gotoNext()">
                    <icon name="arrow-right" />
                </button>
            </div>
        </div>
	</div>
</template>

<script>

export default {
  name: 'signup',
  methods: {
      gotoNext(){
          this.$router.push({name:"verify"});
      }
  }
}
</script>

<style lang="scss" scoped>
.signup{
    .card-holder{
        border-radius: 10px;
        background-color: white;
        padding: 50px 30px;
        margin-top: 25vh;
        min-height: 60vh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
}
</style>