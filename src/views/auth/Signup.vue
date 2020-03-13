<template>
  <div class="signup px-2">
    <div class="card-holder elevate">
      <div class="mb-4">
        <h1>Enter your Details</h1>
      </div>
      <tl-input class="mb-2" placeholder="First Name" v-model="firstName" />
      <tl-input class="mb-2" placeholder="Last Name" v-model="lastName" />
      <tl-input type="email" placeholder="Email" v-model="email" />
      <phone-input 
        uniqueName="signup" 
        :allowSelectCountries="false" 
        v-model="phone"
        :clear="clearPhoneInput" 
      />
      <tl-input class="mb-4" type="password" placeholder="Password" v-model="password" />
      <tl-input class="mb-5" type="password" placeholder="Confirm Password" v-model="confirm_password" />
      <div class="row align-items-center">
        <div class="col-6 text-left">
          <router-link :to="{name: 'login'}">
            Login
          </router-link>
        </div>
        <div class="col-6 text-right">
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
  </div>
</template>

<script>
import axios from 'axios';
import { init, login } from '../../utils/AccountKit.js';
import Helpers from '../../utils/Helpers.js';

export default {
  name: "signup",
  data() {
    return {
      isLoading: false,
      phone: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirm_password: "",
      clearPhoneInput: false,
    };
  },
  computed: {
    isDiabled() {
      if(this.firstName.length < 1 || 
          this.lastName.length < 1 || 
          this.password.length < 1 || 
          this.confirm_password.length < 1 ||
          this.phone.length < 1
      ){
        return true;
      }

      if(!Helpers.isValidEmail(this.email)){
        return true;
      }

      if(this.password !== this.confirm_password) {
        return true;
      }

      return false;
    }
  },
  mounted() {
    init();
  },
  methods: {
    authPhoneNumber(){
         login("PHONE", { phone: this.phone }, this.callBack);
    },
    callBack(response){
        if(response.status === "PARTIALLY_AUTHENTICATED"){
            const url = `${process.env.VUE_APP_GEN_AUTH_SVC_URL}/auth/verify`;
            
            axios
                .post(url, { code: response.code })
                .then(response => {
                    this.$router.push({ name: "register-name" });
                });

        }
    },
    submit(){
      this.isLoading = true;
      const url = `${process.env.VUE_APP_GEN_AUTH_SVC_URL}/auth/register`;

      const phoneNum = this.phone.split('-');

      const data = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
        confirm_password: this.confirm_password,
        phoneNumber: phoneNum[0],
        app: `${process.env.VUE_APP_APP_ID}`,
        uiBaseUrl: Helpers.getOriginUrl(),
        countryCode: phoneNum[1],
        phonePrefix: "+234",
      };

      axios
        .post(url, data)
        .then(response => {
          this.$toasted.show(response.data.message);
          this.isLoading = false;
          this.clearInput();
        })
        .catch(error => {
          Helpers.errorResponse(error, response => {
            this.$toasted.show(response);
            this.isLoading = false;
          });
        });
    },
    clearInput(){
      this.firstName = "";
      this.lastName = "";
      this.email = "";
      this.password = "";
      this.confirm_password = "";
      this.phone = "";
      this.clearPhoneInput = true;

      setTimeout(() => {
          this.clearPhoneInput = false; 
      }, 0);
    },
    gotoNext() {
      if (this.phone.length > 1) {
        if (this.isLoading) return;
        this.isLoading = true;
        this.$store
          .dispatch("checkIsRegistered", {
            phoneNumber: this.phone.split("-")[0]
          })
          .then(response => {
            this.isLoading = false;
            this.$store.commit(
              "setCurrentPhoneNumber",
              this.phone.split("-")[0]
            );

            this.authPhoneNumber();
          })
          .catch(error => {
            this.$store.commit(
              "setCurrentPhoneNumber",
              this.phone.split("-")[0]
            );
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