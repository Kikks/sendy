<template>
<div>
    <div class="blue-back"></div>
	<div class="signup px-4">
        <div class="card-holder elevate">
            <div>
                <h1>Enter your phone number</h1>
            </div>

            <p>
                Automate airtime for your loved ones and members of staff in a recurring manner
            </p>

            <button class="btn">Start Sending</button>
        </div>
	</div>
</div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  components: {
    // HelloWorld
  }
}
</script>

<style lang="scss" scoped>
.blue-back{
    position: absolute;
    background-color: $primary;
    min-height: 45vh;
    width: 100%;
    z-index: -1;
    top: 0;
}
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