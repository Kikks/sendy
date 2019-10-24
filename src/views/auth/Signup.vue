<template>
    <div class="signup px-2">
        <div class="card-holder elevate">
            <div class="mb-4">
                <h1>Enter your phone number</h1>
            </div>
            <phone-input v-model="phone" uniqueName="signup" :allowSelectCountries="false" class="mb-5" />
            <div class="text-right">
                <div class="round-btn" @click="gotoNext()">
                    <icon name="loading" spin v-if="isLoading" />
                    <icon name="arrow-right" v-else />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
//23480609170253
export default {
    name: "signup",
    data() {
        return {
            isLoading: false,
            phone: ""
        };
    },
    methods: {
        gotoNext() {
            if (this.phone.length > 1) {
                if (this.isLoading) return;
                this.isLoading = true;
                this.$store
                    .dispatch("checkIsRegistered", { phoneNumber: this.phone.split('-')[0] })
                    .then(response => {
                        this.isLoading = false;
                        this.$store.commit("setCurrentPhoneNumber", this.phone.split('-')[0]);
                        this.$router.push({ name: "register-name" });
                    })
                    .catch(error => {
                        this.$store.commit("setCurrentPhoneNumber", this.phone.split('-')[0]);
                        this.$router.push({ name: "register-name" });
                    });
            }
            //this.$router.push({name:"verify"});
        }
    }
};
</script>

<style lang="scss" scoped>
.signup {
    .card-holder {
        border-radius: 10px;
        background-color: white;
        padding: 50px 30px;
        margin-top: 20vh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
}
</style>