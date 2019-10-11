<template>
    <div>
        <GreyNavbar title="Send Airtime" />

        <div class="send-airtime">
            <h3><b>Select Categories</b></h3>

            <div class="switcher mt-3">
                <div @click="tab=true" class="switch" :class="tab ? 'active':''">
                    New Recipient
                </div>
                <div @click="tab=false" class="switch" :class="!tab ? 'active':''">
                    Saved Recipients
                </div>
            </div>

            <tl-input class="mt-5" placeholder="Name" />
            <tl-input class="mt-5" placeholder="Phone" type="tel" />
            <tl-input class="mt-5" placeholder="Airtime Amount" type="number" />

            <button class="btn mt-5" @click="transfer()">Transfer</button>
        </div>

    </div>
</template>
<script>
export default {
    data(){
        return{
            tab: true,
        }
    },
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

         .switcher{
            border: 1px solid $primary;
            border-radius: 5px;
            text-align: center;
            display: flex;

            .switch{
                flex: 1;
                padding: 4px 0;
                color: $primary;
                font-size: 16px;
            }
            .active{
                background-color: $primary;
                color: #FFFFFF; 
                //    border:1px solid blue;
                    // border-radius:5px;
            }
        }
    }
</style>