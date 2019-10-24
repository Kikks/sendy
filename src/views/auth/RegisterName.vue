<template>
    <div class="registername px-3">
        <div class="card-holder elevate">
            <div class="mb-4">
                <h1 v-if="!isRegistered">Personalize your experience</h1>
                <h1 v-else>Password</h1>
            </div>
            <div v-if="isRegistered">
                <tl-input
                    class="mb-4"
                    type="password"
                    placeholder="You most recent password"
                    v-model="password"
                />
                 <div class="row align-items-center mt-5">
                    <div class="col-6 text-left">
                        <button @click="$router.go(-1)">Back</button>
                    </div>
                    <div class="col-6 text-right">
                        <button 
                            class="round-btn" 
                            @click="gotoNext"
                            :disabled="isDisabled"
                        >
                            <icon name="loading" spin v-if="isLoading" />
                            <icon name="arrow-right" v-else />
                        </button>
                    </div>
                </div>
            </div>
            <div v-else>
                <div v-if="step === 1">
                    <div style="height: 150px;">
                        <tl-input class="mb-4" placeholder="First Name" v-model="firstName" />
                        <tl-input class="mb-4" placeholder="Last Name" v-model="lastName" />
                        <tl-input type="email" class="mb-4" placeholder="Email" v-model="email" />
                    </div>
                    <div class="row align-items-center mt-5">
                        <div class="col-6 text-left">
                            <button @click="$router.go(-1)">Back</button>
                        </div>
                        <div class="col-6 text-right">
                            <button class="round-btn" @click="step = 2" type="button" :disabled="canMoveToNextView">
                                <icon name="arrow-right"/>
                            </button>
                        </div>
                    </div>
                </div>
                <div v-if="step === 2">
                    <div style="height: 150px;">
                        <tl-input type="password" class="mb-4" placeholder="Password" v-model="password" />
                        <tl-input
                            type="password"
                            class="mb-4"
                            placeholder="Confirm Password"
                            v-model="confirm_password"
                        />
                    </div>
                    <div class="row align-items-center mt-5">
                        <div class="col-6 text-left">
                         <button @click="step = 1">Back</button>
                        </div>
                        <div class="col-6 text-right">
                            <button 
                                class="round-btn" 
                                @click="gotoNext"
                                :disabled="isDisabled"
                            >
                                <icon name="loading" spin v-if="isLoading" />
                                <icon name="arrow-right" v-else />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import Helpers from "../../utils/Helpers.js";

export default {
    name: "registername",
    data() {
        return {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirm_password: "",
            isLoading: false,
            step: 1
        };
    },
    computed: {
        isRegistered() {
            return this.$store.getters.getIsRegistered;
        },
        canMoveToNextView(){
            if((!this.isRegistered && this.firstName.length < 1 ||
                (!this.isRegistered && this.lastName.length < 1) ||
                (!this.isRegistered && !Helpers.isValidEmail(this.email))
            ) ){
                return true;
            }
            return false;
        },
        isDisabled() {
            if (
                (!this.isRegistered && this.confirm_password.length < 1) ||
                this.password.length < 1
            ) {
                return true;
            }
            return false;
        },
        currentPhoneNumber() {
            return this.$store.getters.getCurrentPhoneNumber;
        }
    },
    methods: {
        gotoNext() {
            if (this.isLoading) return;

            if (!this.isRegistered) {
                if(this.password !== this.confirm_password) {
                    this.$toasted.show('Password must match Confirm Password.');
                    return;
                }

                this.isLoading = true;
                this.register();
                return;
            }
            this.isLoading = true;
            this.login();
        },
        login() {
            this.$store
                .dispatch("login", {
                    password: this.password,
                    username: this.currentPhoneNumber,
                    type: "phoneNumber"
                })
                .then(response => {
                    this.isLoading = false;
                    this.$router.push({ name: "home" });
                })
                .catch(error => {
                    Helpers.errorResponse(error, response => {
                        this.isLoading = false;
                        this.$toasted.show(response);
                    });
                });
        },
        register() {
            const url = `${process.env.VUE_APP_GEN_AUTH_SVC_URL}/auth/register`;
            const data = {
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email,
                password: this.password,
                confirm_password: this.confirm_password,
                phoneNumber: this.currentPhoneNumber,
                app: `${process.env.VUE_APP_APP_ID}`
            };

            axios
                .post(url, data)
                .then(response => {
                    this.login();
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
.registername {
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