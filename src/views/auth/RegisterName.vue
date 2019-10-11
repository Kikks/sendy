<template>
	<div class="registername px-4">
        <div class="card-holder elevate">
            <div>
                <h1>Personalize your experience</h1>
            </div>
            <tl-input label="Full Name"/>
            <tl-input label="Email"/>
    
            <div class="row align-items-center mt-5">
                <div class="col-6 text-left">
                    <button>Skip</button>
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
        margin-top: 25vh;
        min-height: 60vh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
}
</style>