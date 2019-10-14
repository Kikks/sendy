<template>
    <div class="signup px-4">
        <div class="card-holder elevate">
            <div class="mb-4">
                <h1>Enter your phone number</h1>
            </div>

            <tl-input type="tel" class="mb-5" placeholder="Phone" v-model="phone" />

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
export default {
    name: "signup",
    data() {
        return {
            isLoading: false,
            phone: "23480609170253"
        };
    },
    methods: {
        gotoNext() {
            if (this.phone) {
                if (this.isLoading) return;
                this.isLoading = true;

                this.$store
                    .dispatch("checkIsRegistered", { phoneNumber: this.phone })
                    .then(response => {
                        this.isLoading = false;
                        this.$store.commit("setCurrentPhoneNumber", this.phone);
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