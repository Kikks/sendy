<template>
    <div>
        <GreyNavbar title="Send Airtime" />

        <div class="send-airtime">
            <h3><b>Select Categories</b></h3>

            <div class="switcher mt-3">
                <div @click="tab=true" class="switch" :class="tab && 'active'">
                    New Recipient
                </div>
                <div @click="tab=false" class="switch" :class="!tab && 'active'">
                    Saved Recipients
                </div>
            </div> 
            <div v-if="tab">
                <tl-input class="mt-5" placeholder="Name" v-model="name" />
                <tl-input class="mt-5" placeholder="Phone" type="tel" v-model="phoneNumber" />
                <tl-input class="mt-5" placeholder="Airtime Amount" type="number" v-model="airtimeAmount" />
            </div>
            <div v-else>
                <tl-input class="mt-5" v-model="searchTerm" placeholder="Search Recipient" icon="magnify"/>
                <div class="search" v-if="searchTerm.length > 0">
                    <div class="searchbox px-3 pb-3">
                        <div class="searchitem pt-3" v-for="(n,i) in 3" :key="i">
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
                <tl-input class="mt-5" placeholder="Airtime Amount" type="number" v-model="airtimeAmount" />
            </div>

            <button class="btn mt-5" @click="transfer()">Transfer</button>
        </div>

    </div>
</template>
<script>
import axios from 'axios';
import Helpers from '../../utils/Helpers';
export default {
    data(){
        return{
            tab: true,
            // search: true,
            searchTerm: '',
            name: "",
            phoneNumber: "",
            airtimeAmount: ""

        }
    },
    methods: {
        transfer(){

            const url = `${process.env.VUE_APP_SENDY_SVC_URL}/sendy/airtime`;

            axios.get(`${process.env.VUE_APP_SENDY_SVC_URL}/sendy/user`).then(response => console.log(response));
            const data = {
                value: Number(this.airtimeAmount),
                category: this.tab ? "newRecipient" : "savedRecipient",
                currencyCode: "NGN",
                phoneNumber: [this.phoneNumber]
            };

            axios
                .post(url, data)
                .then(response => {
                    console.log(response);
                })
                .catch(error => {
                    Helpers.errorResponse(error, response => {
                        console.log(response);
                    });
                });

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
            // max-width: calc($full-width - 10px);
            max-width: $full-width;
        }
        .searchbox{
            width: 100%;
            max-width: $full-width;
            height:300px;
            background: #FFFFFF;
            box-shadow: 0px 20px 50px #E9EDEE;
            border-radius: 0px 0px 10px 10px;

            .searchitem{
                border-bottom: 1px solid#E6EDFF;;
                &:last-child{
                    border-bottom: none;
                }
            }

            .searchrow{
                color:#D2D5DB;
                font-size:14px;
            }
        }
    }
</style>