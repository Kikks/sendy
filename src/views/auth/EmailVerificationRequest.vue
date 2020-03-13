<template>
<div class="login px-2">
    <div class="card-holder elevate">
    <div class="mb-4">
        <h1>Check your email for verification link.</h1>
        <h5 class="pt-2">OR</h5>
        <h3 class="mb-3">
            You can resend the verification link below
        </h3>
    </div>
    <tl-input type="email" placeholder="Email" v-model="email" class="mb-5" />
    <div class="row align-items-center">
        <div class="col-6 text-left">
            <button @click="$router.push({ name: 'login' })">Login</button>
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
  mounted(){
    this.setEmail();
  },
  methods: {
    setEmail(){
      if(this.$route.query.email) {
        this.email = this.$route.query.email;
      }
    },
    submit(){
      this.isLoading = true;

      const url = `${process.env.VUE_APP_GEN_AUTH_SVC_URL}/auth/email-verification-request`;

      axios
        .post(url, { 
          email: this.email,
          uiBaseUrl: Helpers.getOriginUrl(),
        })
        .then(response => {
          this.$toasted.show(response.data.message);
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