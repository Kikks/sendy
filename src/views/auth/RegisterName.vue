<template>
	<div class="registername px-4">
        <div class="card-holder elevate">
            <div>
                <h1>Enter your phone number</h1>
            </div>

            <p>
                Register
            </p>

            <div class="text-right">
                <button class="round-btn">
                    <icon name="arrow-right" />
                </button>
            </div>
        </div>
	</div>
</template>

<script>

export default {
  name: 'registername',
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