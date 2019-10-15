<template>
    <div class="activity">
        <div class="header">
            <h3 class="mb-3">Wallet Balance</h3>
            <h1 class="mb-4">NGN4,000</h1>
            <div class="px-5">
                <button class="btn outline" @click="gotoAirtime()">
                    Send Airtime
                </button>
            </div>
        </div>
        <div class="recent-activity">
            <h2 class="mb-4">Recent Actions</h2>
            <div v-for="(activity, i) in activities" :key="i" class="activityRow">
                <div class="row firstRow">
                    <div class="col-6 blue">
                       {{activity.description}}
                    </div>
                    <!-- <div class="col-6 text-right" :class="{red: !activity.add, green: activity.add}"> -->
                    <div class="col-6 text-right" :class="activity.add ? 'green' : 'red'">
                        NGN{{activity.amount}}
                    </div>
                </div>
                <div class="row secondRow">
                    <div class="col-6 blue">
                        {{activity.date}}
                    </div>
                    <div class="col-6 text-right">
                        {{activity.group}}
                    </div>
                </div>
            </div>
           
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import Helpers from '../../utils/Helpers';

export default {
    data(){
        return{
            activities:[
                {
                    description: 'Airtime Sent',
                    amount: 6000,
                    date: '30 Sep, 2019',
                    group: 'Cashier Group',
                    add: false,
                },
                {
                    description: 'Wallet Top-up',
                    amount: 10000,
                    date: '26 Sep, 2019',
                    group: 'Cashier Group',
                    add: true,
                },
                {
                    description: 'Airtime Sent',
                    amount: 3000,
                    date: '24 Sep, 2019',
                    group: 'Cashier Group',
                    add: false,
                },
                {
                    description: 'Wallet Top-up',
                    amount: 10000,
                    date: '30 Sep, 2019',
                    group: 'Cashier Group',
                    add: true,
                },
            ]
        }
    },
    methods: {
        getActivities(){
            const url = `${process.env.VUE_APP_SENDY_SVC_URL}/sendy/log`;
            console.log(url);

            axios
                .get(url)
                .then(response => {
                    console.log(response);
                })
                .catch(error => {
                    Helpers.errorResponse(error, (response) => {
                        this.errorMessage = response;
                    });
                });
        },
        gotoAirtime(){
            this.$router.push({name: "send-airtime"});
        }
    },
    mounted(){
        this.getActivities();
    }
}
</script>
<style lang="scss" scoped>
// hr{
//     margin-top: 50px;
// }
    .activity{
        background-color: $primary;
        min-height: 100vh;
    }
    .header{
        background-color: $primary;
        color: white;
        text-align: center;
        padding-top: 30px;
        padding-bottom: 40px;
        h3{
            font-size: 16px;
            color: rgba(255, 255, 255, 0.7);
        }

        h1{
            color: white;
            font-weight: bold;
        }
    }
    .recent-activity{
        padding: 20px;
        background-color: white;
        min-height: 80vh;
        border-radius: 20px 20px 0px 0px;  
        .activityRow{
            padding: 20px 0;
            border-bottom: 0.5px solid #E6EDFF;
            .red{
                color:#F43939;
            }
            .green{
                color: #54C100;
            }
            .blue{
                color:#030039
            }

            .secondRow{
                font-size: 14px;
                opacity: 0.5;
            }
        }

        h2{
            font-size: 17px;
        }
    }
</style>