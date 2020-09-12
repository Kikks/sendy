<template>
    <div>
        <GreyNavbar title="Add Card" />

        <div class="add-card">
            <tl-input class="amount" placeholder="Enter Amount" v-model="amount" type="number" />
            <p class="mb-5">This will be funded to your account.</p>
            <button class="btn mt-5" :disabled="amount.length < 2 || isLoading" @click="addCard">
                <icon name="loading" spin size="0.9" class="mr-2" v-if="isLoading"/> Save Card 
            </button>
        </div>

    </div>
</template>
<script>
import axios from 'axios';
import Pay from '../../utils/Payment.js';
import Helpers from '../../utils/Helpers';
export default {
    data(){
        return {
            amount: "10",
            isLoading: false
        }
    },
    computed: {
        user(){
            return this.$store.getters.getUser;
        }
    },
    methods: {
        addCard(){
             this.$loadScript("https://js.paystack.co/v1/inline.js")
                .then(() => {
                    new Pay({ amount: this.amount, email: this.user.email, user: this.user.id }).initiatePayment(this.referencePayment);
                })
                .catch(() => {
                    this.$toasted.show("Payment service not available currently.");
                });
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
                    
                    this.$store.dispatch('getActivities');
                    this.$store.dispatch('getCards');

                    if(response.data && 
                        response.data.authorization && 
                        !response.data.authorization.reusable
                    ){
                        this.$toasted.show('Card is not reusable');
                        this.$router.push({ name: 'topup' });
                        return;
                    }

                    this.$toasted.show('Card added successfully');
                    this.$router.push({ name: 'topup' });

                })
                .catch(error => {
                    Helpers.errorResponse(error, response => {
                         this.isLoading = false;
                        this.$toasted.show(response);
                    });
                });
        }
    }
}
</script>
<style lang="scss" scoped>
    .add-card{
        margin-top: 55px;
        padding: 20px;
        // display: flex;
        // flex-direction: column;
        //justify-content: space-between;
        min-height: 50vh;
    }
</style>