<template>
    <div class="registername px-4">
        <div class="card-holder elevate">
            <div class="mb-4">
                <h1>Personalize your experience</h1>
            </div>
            <div v-if="isRegistered">
                <tl-input 
                    class="mb-4" 
                    placeholder="You most recent password" 
                    v-model="password" 
                />
            </div>
            <div v-else>
                <tl-input 
                    class="mb-4" 
                    placeholder="First Name" 
                    v-model="firstName" 
                />
                <tl-input 
                    class="mb-4" 
                    placeholder="Last Name" 
                    v-model="lastName" 
                />
                <tl-input 
                    type="email" 
                    class="mb-4" 
                    placeholder="Email" 
                    v-model="email" 
                />
                <tl-input 
                    type="password" 
                    class="mb-4" 
                    placeholder="Password" 
                    v-model="password" 
                />
                 <tl-input 
                    type="password" 
                    class="mb-4" 
                    placeholder="Confirm Password" 
                    v-model="confirm_password" 
                />
            </div>

            <div class="row align-items-center mt-5">
                <div class="col-6 text-left">
                    <button @click="$router.go(-1)">Back</button>
                </div>
                <div class="col-6 text-right">
                    <button class="round-btn" @click="gotoNext">
                        <icon name="loading" spin v-if="isLoading" />
                        <icon name="arrow-right" v-else />
                    </button>
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
            password:"",
            confirm_password: "",
            isLoading: false
        };
    },
    computed: {
        isRegistered(){
            return this.$store.getters.getIsRegistered;
        },
        isDisabled() {
            if (
                !this.isRegistered && this.firstName.length < 1 ||
                !this.isRegistered && this.lastName.length < 1 ||
                !this.isRegistered && !Helpers.isValidEmail(this.email) ||
                !this.isRegistered && this.confirm_password.length < 1 ||
                this.password.length < 1
            ) {
                return true;
            }
            return false;
        }
    },
    methods: {
        gotoNext() {
            if (!this.isDisabled) {
                if(this.isLoading) return;

                this.isLoading = true;

                if(!this.isRegistered){
                    this.register();
                    return;
                }
                this.login();
            }
        },
        login(){
            this.$store
                .dispatch('login', { password: this.password, phoneNumber: '23480609170253' })
                .then(response => {
                    this.isLoading = false;
                    this.$router.push({ name: "home" });
                })
                .catch(error => {
                    Helpers.errorResponse(error, (response) => {
                        this.isLoading = false;
                        this.$toasted.show(response);
                    })
                    console.log(error);
                });
        },
        register(){

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