<template>
    <div class="activity">
        <div class="header">
            <h3 class="mb-3">Wallet Balance</h3>
            <h1
                class="mb-4"
            >{{ userInfo.defaultCurrency }} {{ userInfo.wallet ? userInfo.wallet : '0.00' }}</h1>
            <div class="px-5">
                <button class="btn outline" @click="gotoAirtime()">Send Airtime</button>
            </div>
        </div>
        <div class="recent-activity">
            <h2 class="mb-4">Recent Actions</h2>
            <div
                class="d-flex justify-content-center align-items-center"
                style="height: 50vh"
                v-if="isLoading"
            >
                <icon name="loading" spin primary />
            </div>
            <div
                class="d-flex justify-content-center align-items-center"
                style="height: 50vh"
                v-if="errorMessage"
            >{{errorMessage}}</div>
            <div
                class="d-flex justify-content-center align-items-center"
                style="height: 50vh"
                v-if="!isLoading && refinedActivities.length < 1"
            >
                You don't have any recent actions
            </div>
            
            <div v-for="(activity, i) in refinedActivities" :key="i" class="activityRow">
                <div class="row firstRow">
                    <div class="col-6 blue">{{activity.description}}</div>
                    <div
                        class="col-6 text-right"
                        :class="activity.type  === 'credit' ? 'green' : 'red'"
                    >{{ activity.currency }}{{ activity.amount }}</div>
                </div>
                <div class="row secondRow">
                    <div class="col-6 blue">{{activity.date}}</div>
                    <div class="col-6 text-right">{{ activity.title ? activity.title : '----' }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from "axios";
import moment from "moment";
import Helpers from "../../utils/Helpers";

export default {
    data() {
        return {
            activities: [],
            isLoading: false,
            errorMessage: ""
        };
    },
    computed: {
        refinedActivities() {
            let refinedArray = [];
            this.$store.getters.getActivities.forEach(activity => {
                refinedArray.push({
                    ...activity,
                    date: moment(activity.createdAt).format("MMM Do YY")
                });
            });
            return refinedArray;
        },
        userInfo(){
            return this.$store.getters.getUserInfo;
        }
    },
    methods: {
        getUserInfo() {
            
        },
        getActivities() {
            this.isLoading = true;
            this.$store.dispatch('getActivities')
                .then(response => {
                    this.isLoading = false;
                })
                .catch(error => {
                    Helpers.errorResponse(error, response => {
                        this.isLoading = false;
                        this.errorMessage = response;
                    });
                });
            
        },
        gotoAirtime() {
            this.$router.push({ name: "send-airtime" });
        }
    },
    mounted() {
        this.$store.dispatch('getUserInfo');
        if(this.$store.getters.getActivities.length < 1) {
            this.getActivities();
        }
    }
};
</script>
<style lang="scss" scoped>
// hr{
//     margin-top: 50px;
// }
.activity {
    background-color: $primary;
    min-height: 100vh;
}
.header {
    background-color: $primary;
    color: white;
    text-align: center;
    padding-top: 30px;
    padding-bottom: 40px;
    h3 {
        font-size: 16px;
        color: rgba(255, 255, 255, 0.7);
    }

    h1 {
        color: white;
        font-weight: bold;
    }
}
.recent-activity {
    padding: 20px;
    background-color: white;
    min-height: 80vh;
    border-radius: 20px 20px 0px 0px;
    .activityRow {
        padding: 20px 0;
        border-bottom: 0.5px solid #e6edff;
        .red {
            color: #f43939;
        }
        .green {
            color: #54c100;
        }
        .blue {
            color: #030039;
        }

        .secondRow {
            font-size: 14px;
            opacity: 0.5;
        }

        &:last-child {
            margin-bottom: 72px;
        }
    }

    h2 {
        font-size: 17px;
    }
}
</style>