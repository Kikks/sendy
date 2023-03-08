<template>
  <div class="login px-2">
    <div class="card-holder elevate">
      <div class="mb-4">
        <h1>Reset</h1>
        <h3 class="pt-2">Fill in your new password.</h3>
      </div>
      <tl-input
        class=""
        type="password"
        placeholder="New Password"
        v-model="newPassword"
      />
      <tl-input
        class="mb-5"
        type="password"
        placeholder="Confirm Password"
        v-model="confirmPassword"
      />
      <div class="row align-items-center">
        <div class="col-6 text-left">
          <router-link :to="{ name: 'login' }"> Login </router-link>
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
  name: 'signup',
  data() {
    return {
      isLoading: false,
      newPassword: '',
      confirmPassword: '',
    };
  },
  computed: {
    isDisabled() {
      if (this.newPassword.length < 1 || this.confirmPassword.length < 1) {
        return true;
      }
      if (this.newPassword !== this.confirmPassword) return true;

      return false;
    },
  },
  methods: {
    submit() {
      this.isLoading = true;
      const url = `${process.env.VUE_APP_GEN_AUTH_SVC_URL}/auth/update-password`;

      const data = {
        token: this.$route.query.token || '',
        password: this.newPassword,
        confirm_password: this.confirmPassword,
      };

      axios
        .patch(url, data)
        .then((response) => {
          this.isLoading = false;
          this.$toasted.show(response.data.message);
          setTimeout(() => {
            this.$router.push({ name: 'login' });
          }, 2000);
        })
        .catch((error) => {
          Helpers.errorResponse(error, (response) => {
            this.isLoading = false;
            this.$toasted.show(response);
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
