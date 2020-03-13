<template>
<div class="login px-2">
    <div class="card-holder elevate">
    <div class="mb-4">
        <h1>Enter your Details</h1>
        <h3 class="mt-2">
            Don't have an account?
            <router-link :to="{name: 'signup'}">Sign up</router-link>
        </h3>
        
    </div>
    <tl-input type="email" placeholder="Email" v-model="email" />
    <tl-input class="mb-5" type="password" placeholder="Password" v-model="password" />
    <div class="row align-items-center">
        <div class="col-6 text-left">
            <router-link :to="{name: 'password-reset-request'}">
                Forgot Password?
            </router-link>
        </div>
        <div class="col-6 text-right">
            <button 
                class="round-btn"
                @click="submit"
                :disabled="isDisabled || isLoading"
                >
                <icon name="loading" spin v-if="isLoading" />
                <icon name="arrow-right" v-else />
            </button>
        </div>
    </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Helpers from '../../utils/Helpers.js';

export default {
  name: "signup",
  data() {
    return {
      isLoading: false,
      email: "",
      password: "",
    };
  },
  computed: {
    isDisabled() {
      if(this.password.length < 1){
        return true;
      }

      if(!Helpers.isValidEmail(this.email)) {
          return true;
      }
      return false;
    }
  },
  methods: {
    submit(){
      this.isLoading = true;

      const data = {
          username: this.email,
          password: this.password,
          type: "email",
      };

      this.$store
        .dispatch('login', data)
        .then(response => {
            const { user } = response.data.data;
            if(user.emailVerified){
                this.$router.push({ name: 'home' });
            }
            this.isLoading = false;
        })
        .catch(error => {
            Helpers.errorResponse(error, response => {
                if(response === "Your email is not verified.") {
                    this.$router.replace({ name: 'email-verify-request', query: { email: this.email } });
                }
                this.$toasted.show(response);
                this.isLoading = false;
            });
        });      
    },
  }
};
</script>

<style lang="scss" scoped>
.login {
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