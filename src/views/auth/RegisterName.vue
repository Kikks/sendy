<template>
	<div class="registername px-4">
        <div class="card-holder elevate">
            <div class="mb-4">
                <h1>Personalize your experience</h1>
            </div>

            <tl-input class="mb-4" placeholder="Full Name"/>
            <tl-input type="email" class="mb-4" placeholder="Email"/>
    
            <div class="row align-items-center mt-5">
                <div class="col-6 text-left">
                    <button @click="gotoNext()">Skip</button>
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
  name: 'registername',
  methods: {
      gotoNext(){
          this.$router.push({name: 'home'});
      }
  }
}
</script>

<style lang="scss" scoped>
.registername{
    .card-holder{
        border-radius: 10px;
        background-color: white;
        padding: 50px 30px;
        margin-top: 20vh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
}
</style>