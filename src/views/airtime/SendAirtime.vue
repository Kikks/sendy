<template>
    <div>
        <GreyNavbar title="Send Airtime" />

        <div class="send-airtime">
            <h3><b>Select Category</b></h3>

            <tl-input class="mt-5" placeholder="Name" />
            <tl-input class="mt-5" placeholder="Phone" type="tel" />
            <tl-input class="mt-5" placeholder="Airtime Amount" type="number" />

            <button class="btn mt-5" @click="transfer()">Transfer</button>
        </div>

    </div>
</template>

<script>
export default {
    methods: {
        transfer(){
            let password = prompt("Enter password to complete transfer");
            if(password){
                alert("The sum of NGN3000 has been successfully sent");
            }
        }
    },
}
</script>

<style lang="scss" scoped>
    .send-airtime{
        margin-top: 55px;
        padding: 20px;
    }
</style>