<template>
    <div class="activity">
        <div class="recent-activity">
            <div style="cursor: pointer; margin-left: -7px" @click="$router.push({name: 'topup'})">
                <icon name="chevron-left" primary /> Go back
            </div>
            <h2 class="mt-3">Fund Sendy Wallet</h2>
                <tl-input class="amount" placeholder="Enter Amount" v-model="amount" />

                <button class="btn mt-5" @click="pay" :disabled="amount.length < 2 || isLoading">
                    <icon name="loading" spin size="0.9" class="mr-1" v-if="isLoading" />Continue
                </button>
            <p
                class="mt-5 text-center pt-5"
            >Having your wallet funded keeps your contacts credited recurrently</p>
        </div>
    </div>
</template>
<script>
import axios from "axios";
import Helpers from "../../utils/Helpers";
import Pay from '../../utils/Payment.js';

export default {
    data() {
        return {
            amount: "",
            isLoading: false
        };
    },
    computed: {
        user() {
            return this.$store.getters.getUser;
        },
        canSubmit() {
            if (this.amount) return false;
        }
    },
    methods: {
        pay() {
            new Pay({ email: this.user.email, amount: this.amount })
                .initiatePayment(this.referencePayment);
        },
        referencePayment(response) {
            
            this.isLoading = true;
            const url = `${process.env.VUE_APP_SENDY_SVC_URL}/sendy/payment`;
            axios
                .post(url, {
                    reference: response.reference
                })
                .then(response => {
                    this.isLoading = false;
                    this.amount = "";
                    this.$toasted.show(response.data.message);
                    this.$store.dispatch('getActivities');
                    this.$router.push({ name: "home" });
                })
                .catch(error => {
                    Helpers.errorResponse(error, response => {
                        this.isLoading = false;
                        this.$toasted.show(response);
                    });
                });
        },
        
    }
};
</script>
<style lang="scss" scoped>
.activity {
    min-height: 100vh;
}
.recent-activity {
    padding: 20px;
    background-color: white;
    height: 800px;
    border-radius: 20px 20px 0px 0px;
    .amount {
        margin-bottom: 80px;
    }
    h2 {
        font-size: 17px;
        margin-bottom: 120px;
    }
}
</style>