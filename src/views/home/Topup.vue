<template>
    <div class="activity">
        <div class="recent-activity">
            <h2 class="mt-3">Fund Sendy Wallet</h2>

            <tl-input class="amount" placeholder="Enter Amount" v-model="airtimeAmount" />

            <button class="btn mt-5" @click="pay" :disabled="airtimeAmount.length < 2">
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
export default {
    data() {
        return {
            airtimeAmount: "",
            isLoading: false
        };
    },
    computed: {
        user() {
            return this.$store.getters.getUser;
        },
        canSubmit() {
            if (this.airtimeAmount) return false;
        }
    },
    methods: {
        pay() {
            let handler = PaystackPop.setup({
                key: `${process.env.VUE_APP_PAYSTACK_TEST_KEY}`,
                email: this.user.email, //danieel@gmail.com adedejiayokunledaniel@gmail.com
                amount: Number(this.airtimeAmount) * 100,
                currency: "NGN",
                callback: response => {
                    this.referencePayment(response);
                },
                onClose: () => console.log("closed")
            });
            handler.openIframe();
        },
        referencePayment(response) {
            if (this.isLoading) return;

            this.isLoading = true;
            const url = `${process.env.VUE_APP_SENDY_SVC_URL}/sendy/payment`;
            axios
                .post(url, {
                    reference: response.reference
                })
                .then(response => {
                    this.isLoading = false;
                    this.$toasted.show(response.data.message);
                    this.$router.push({ name: "home" });
                })
                .catch(error => {
                    Helpers.errorResponse(error, response => {
                        this.isLoading = false;
                        this.$toasted.show(response);
                    });
                });
        }
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