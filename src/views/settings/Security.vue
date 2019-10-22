<template>
    <div>
        <GreyNavbar title="Security" />

        <div class="security">
            <div>
                <p class="text-center mt-1 mb-5">
                   Enter reciepient's name, phone number and airtime frequency
                </p>

                <tl-input type="password" class="mb-5" placeholder="Enter Password" v-model="password" />
                <tl-input type="password" class="mb-5" placeholder="Confirm Password" v-model="confirm_password" />
            </div>

            <button 
                class="btn mt-5" 
                :disabled="canSubmit || isLoading" 
                @click="updatePassword"
            >   
                <icon name="loading" spin class="mr-1" size="0.9"  v-if="isLoading"/>Save Changes
            </button>
        </div>

    </div>
</template>
<script>

import axios from 'axios';
import Helpers from '../../utils/Helpers.js';

export default {
    data(){
        return {
            password: "",
            confirm_password: "",
            isLoading: false
        }
    },
    computed: {
        canSubmit(){
            if(this.password.length < 1 || this.confirm_password.length < 1) {
                return true;
            }
            return false;
        }
    },
    methods: {
        updatePassword(){
            if(this.password !== this.confirm_password){
                this.$toasted.show('Password must match');
                return;
            }
            this.isLoading = true;

            const data = {
                password: this.password,
                confirm_password: this.confirm_password
            };

            this.$store
                .dispatch('updateUser', { data, type: 'password_info' })
                .then(response => {
                    this.isLoading = false;
                    this.$toasted.show(response.data.message);
                    this.$router.push({name: 'home'});
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
    .security{
        margin-top: 55px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 80vh;
    }
</style>