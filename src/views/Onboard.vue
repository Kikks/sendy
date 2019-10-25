<template>
	<div class="home px-4">
		<div>
			<img alt="Vue logo" src="../assets/logo.svg">
		</div>

		<p>
			Automate airtime for your loved ones and members of staff in a recurring manner
		</p>

		<button class="btn" @click="gotoNext">Start Sending</button>
	</div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'home',
  methods: {
      gotoNext(){
          this.$router.push({name: 'signup'});
      }
  },
  mounted(){
      const userData = JSON.parse(window.localStorage.getItem("tinylabs-sendy-user"))
      if(userData){
          this.$router.push({ name: 'home'});
      }
    //   if(this.$store.state.isLoggedIn){
    //       this.$router.push({ name: 'home'});
    //   }
  }
}
</script>

<style lang="scss" scoped>
.home{
    // border: 1px solid red;
    text-align: center;
    min-height: 80vh;
    display: flex;
    flex-direction: column;
	justify-content: space-around;
}
</style>