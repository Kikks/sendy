<template>
  <div class="login px-2">
    <div class="card-holder elevate">
      <div class="mb-4">
        <h1>Enter your Details</h1>
      </div>
      <phone-input uniqueName="signup" :allowSelectCountries="false" v-model="phone" :clear="clearPhoneInput" />
      <tl-input class="mb-5" type="password" placeholder="Password" v-model="password" />
      <div class="text-right">
        <button 
          class="round-btn"
          @click="submit"
          :disabled="isDiabled || isLoading"
        >
          <icon name="loading" spin v-if="isLoading" />
          <icon name="arrow-right" v-else />
        </button>
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
      phone: "",
      password: "",
      clearPhoneInput: false,
    };
  },
  computed: {
    isDiabled() {
      if(this.phone.length < 1 ||
        this.password.length < 1){
        return true;
      }
      return false;
    }
  },
  methods: {
    submit(){
      this.isLoading = true;
      const phoneNum = this.phone.split('-');
      
      const data = {
          username: phoneNum[0],
          password: this.password,
          type: "phoneNumber",
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
                this.$toasted.show(response);
                this.isLoading = false;
            });
        });      
    },
    clearInput(){
      this.email = "";
      this.password = "";

      this.clearPhoneInput = true;

    setTimeout(() => {
        this.clearPhoneInput = false;
    }, 0);
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