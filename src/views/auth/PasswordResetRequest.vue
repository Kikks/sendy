<template>
<div class="login px-2">
    <div class="card-holder elevate">
    <div class="mb-4">
        <h1>Reset</h1>
        <h3 class="pt-2">
           Fill in your email.
        </h3>
    </div>
    <tl-input type="email" placeholder="Email" v-model="email" class="mb-5" />
    <div class="row align-items-center">
        <div class="col-6 text-left">
            <router-link :to="{name: 'login'}">
                Back to Login
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
    };
  },
  computed: {
    isDisabled() {
      if(!Helpers.isValidEmail(this.email)) return true;
      return false;
    }
  },
  methods: {
    submit(){
      this.isLoading = true;

      const url = `${process.env.VUE_APP_GEN_AUTH_SVC_URL}/auth/password-reset-request`;

      axios
        .post(url, { 
          email: this.email,
          uiBaseUrl: Helpers.getOriginUrl(),
        })
        .then(response => {
          this.$toasted.show(response.data.message);
          this.email = "";
          this.isLoading = false;
        })
        .catch(error => {
          Helpers.errorResponse(error, response => {
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