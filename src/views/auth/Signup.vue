<template>
    <div class="signup px-4">
        <div class="card-holder elevate">
            <div class="mb-4">
                <h1>Enter your phone number</h1>
            </div>
            <vue-phone-number-input 
                valid-color="#006FFF" 
                :translations="phoneNumberInputOptions" 
                default-country-code="NG" 
                class="mb-5" 
                v-model="phone" 
                size="lg" 
                required 
                error 
                :countries-height="25" 
                @update="handlePhoneInputUpdate"
            />
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
            phone: "",
            phoneNumberInputOptions: {
                countrySelectorLabel: 'Code',
                countrySelectorError: 'Select a valid code',
                phoneNumberLabel: 'Phone',
                example: 'Invalid number. e.g :'
            },
            formattedPhoneNumberInfo: {}
        };
    },
    methods: {
        gotoNext() {
            if (this.formattedPhoneNumberInfo.isValid) {
                if (this.isLoading) return;
                this.isLoading = true;
                this.$store
                    .dispatch("checkIsRegistered", { phoneNumber: this.formattedPhoneNumberInfo.formattedNumber })
                    .then(response => {
                        this.isLoading = false;
                        this.$store.commit("setCurrentPhoneNumber", this.formattedPhoneNumberInfo.formattedNumber);
                        this.$router.push({ name: "register-name" });
                    });
            }
            //this.$router.push({name:"verify"});
        },
        handlePhoneInputUpdate($event){
            this.formattedPhoneNumberInfo = $event;
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