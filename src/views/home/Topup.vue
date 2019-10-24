<template>
    <div class="activity">
        <div class="recent-activity">
            <h2 class="mt-3">Fund Sendy Wallet</h2>
            <div class="recurring-cards">
                <div class="row py-3">
                    <div class="col-12">
                        <h3>Choose  existing card</h3>
                    </div>
                </div>
                <div class="row" v-if="isLoading">
                    <div class="col-12 text-center">
                        <icon name="loading" spin primary />
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <div v-if="cards.length < 1" class="py-2">
                            You currently don't have any saved card.
                        </div>
                        <div class="recurring-card" v-for="card in cards" :key="card.id" @click="showCardTopupModal(card)">
                            <span class="font-weight-bold">**** **** **** ****</span> {{card.last4}}
                        </div>
                    </div>
                </div>
            </div>
            <div class="row my-3">
                <div class="col-12 text-center">
                    <h3>OR</h3>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <button class="btn" @click="goToTopPage">
                        Direct Topup using Paystack
                    </button>
                </div>
            </div>
            <p
                class="mt-5 text-center pt-5"
            >Having your wallet funded keeps your contacts credited recurrently</p>
        </div>
        <tl-modal :name="cardTopupModalName" :clickToClose="false">
            <div class="row justify-content-center">
                <div class="col-10">
                    <h2>Topup your wallet</h2>
                    <tl-input class="amount" placeholder="Enter Amount" v-model="amount" />
                    <button class="btn mt-5" @click="pay" :disabled="amount.length < 2 || isPayLoading">
                        <icon name="loading" spin size="0.9" class="mr-1" v-if="isPayLoading" />Continue
                    </button>
                </div>
            </div>
        </tl-modal>
    </div>
</template>
<script>
import axios from "axios";
import Helpers from "../../utils/Helpers";
export default {
    data() {
        return {
            amount: "",
            isLoading: false,
            isPayLoading: false,
            cards: [],
            cardTopupModalName: 'card-top-up-modal',
            currentCard: {}
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
        getCards(){
            this.isLoading = true;
            const url = `${process.env.VUE_APP_SENDY_SVC_URL}/sendy/card`;
            axios
                .get(url)
                .then(response => {
                    this.isLoading = false;
                    this.cards = response.data.data;
                })
                .catch(error => {
                    Helpers.errorResponse(error, response => {
                        this.isLoading = false;
                        this.errorMessage = response;
                    })
                });
        },
        showCardTopupModal(card){
            this.currentCard = card;
             this.$modal.show(this.cardTopupModalName);
        },
        pay(){

            this.isPayLoading = true;

            const url = `${process.env.VUE_APP_SENDY_SVC_URL}/sendy/payment/charge`;

            const data = {
                card: this.currentCard.id,
                amount: this.amount
            };

            axios
                .post(url, data)
                .then(response => {

                    this.isPayLoading = false;
                    this.amount = "";
                    this.$toasted.show(response.data.message);
                    this.$store.dispatch('getActivities');
                    this.$modal.hide(this.cardTopupModalName);
                    this.$router.push({name: 'home'});
                })
                .catch(error => {
                    Helpers.errorResponse(error, response => {
                        this.isPayLoading = false;
                        this.$toasted.show(response);
                    });
                });
        },
        goToTopPage(){
            this.$router.push({name: 'directtopup'});
        }
    },
    mounted(){
        this.getCards();
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

    .recurring-card {
        padding: 12px 5px;
        border-radius: 5px;
        border: 1px solid #006FFF;
        background-color: white;
        box-shadow: 0px 20px 80px #E5E5E5;
        display: flex;
        align-content: center;
        cursor: pointer;
        margin-bottom: 10px;

        &:last-child {
            margin-bottom: 0px;
        }

    }
}
</style>