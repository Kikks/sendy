<template>
  <div class="login px-2">
    <div class="card-holder elevate">
      <div class="mb-4">
        <h1>Enter your Details</h1>
        <h3 class="mt-2">
          Don't have an account?
          <router-link :to="{ name: 'signup' }">Sign up</router-link>
        </h3>
      </div>
      <tl-input
        label="Email Address"
        type="email"
        placeholder="Email"
        v-model="email"
      />
      <tl-input
        label="Password"
        class="mb-5"
        type="password"
        placeholder="Password"
        v-model="password"
      />
      <div class="row align-items-center">
        <div class="col-12 text-right">
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
      <div class="row align-items-center mt-4">
        <div class="col-12 text-center">
          <router-link :to="{ name: 'password-reset-request' }">
            Forgot Password?
          </router-link>
        </div>
      </div>
      <div class="row align-items-center mt-4">
        <div class="col-12 text-center">
          <router-link :to="{ name: 'help' }"> Get in touch </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Helpers from '../../utils/Helpers.js';

export default {
  name: 'signup',
  data() {
    return {
      isLoading: false,
      email: '',
      password: '',
    };
  },
  computed: {
    isDisabled() {
      if (this.password.length < 1) {
        return true;
      }

      if (!Helpers.isValidEmail(this.email)) {
        return true;
      }
      return false;
    },
  },
  methods: {
    submit() {
      this.isLoading = true;

      const data = {
        email: this.email,
        password: this.password,
      };

      this.$store
        .dispatch('login', data)
        .then((response) => {
          const { user } = response.data.data;
          if (user.status === 'active') {
            this.$router.push({ name: 'home' });
            return;
          }

          if (user.status === 'pending') {
            localStorage.setItem('userEmail', this.email);
            this.$router.push({ name: 'email-verify-request' });
            return;
          }
          this.isLoading = false;
        })
        .catch((error) => {
          Helpers.errorResponse(error, (response) => {
            if (response === 'Your email is not verified.') {
              this.$router.replace({
                name: 'email-verify-request',
                query: { email: this.email },
              });
            }
            this.$toasted.show(response);
            this.isLoading = false;
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.login {
  @media (min-width: 768px) {
    width: 100%;
  }

  .card-holder {
    border-radius: 10px;
    background-color: white;
    padding: 50px 30px;
    margin-top: 20vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    @media (min-width: 768px) {
      margin-top: 0;
      width: 100%;
    }
  }
}
</style>
