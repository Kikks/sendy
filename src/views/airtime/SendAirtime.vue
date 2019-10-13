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
            <div class="search" v-if="search">
                <tl-input icon="magnify"></tl-input>
                <div class="searchbox">
                    <div class="searchist pt-3" v-for="(n,i) in 3" :key="i">
                        <div class="row">
                            <div class="col-6">Nathan</div>
                            <div class="col-6 text-right" >NGN500</div>
                        </div>
                        <div class="row searchrow">
                            <div class="col-6">+234 801 123 4567</div>
                            <div class="col-6 text-right">Monthly</div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="tab">
                <tl-input class="mt-5" placeholder="Name" />
                <tl-input class="mt-5" placeholder="Phone" type="tel" />
                <tl-input class="mt-5" placeholder="Airtime Amount" type="number" />
            </div>
            <div v-else>
                <tl-input class="mt-5" placeholder="Search Recipient" icon="magnify"/>
                <tl-input class="mt-5" placeholder="Airtime Amount" type="number" />
            </div>

            <button class="btn fixedbtn mt-5" @click="transfer()">Transfer</button>
        </div>

    </div>
</template>
<script>
export default {
    data(){
        return{
            tab: true,
            search:false,
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
        .fixedbtn{
            position: fixed;
            top:680px;
            left:3.5px;
            width:98%;
        }
        .search{
            position:absolute;
            width:90%;
        }
        .searchbox{
            width:100%;
            height:300px;
            background: #FFFFFF;
            box-shadow: 0px 20px 50px #E9EDEE;
            border-radius: 0px 0px 10px 10px;
            .searchrow{
                color:lightgray;
            }
        }
    }
</style>