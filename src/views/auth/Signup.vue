<template>
  <div class="signup px-2">
    <div class="card-holder elevate">
      <div class="mb-4">
        <h1>Enter your Details</h1>
      </div>
      <tl-input
        label="First Name"
        placeholder="First Name"
        v-model="firstName"
      />
      <tl-input label="Last Name" placeholder="Last Name" v-model="lastName" />
      <tl-input
        label="Email"
        type="email"
        placeholder="Email"
        v-model="email"
      />
      <tl-select
        label="Country"
        placeholder="Select Country"
        v-model="countryId"
        :options="countries"
      />
      <tl-input
        label="Password"
        type="password"
        placeholder="Password"
        v-model="password"
      />
      <tl-input
        label="Confirm Password"
        class="mb-5"
        type="password"
        placeholder="Confirm Password"
        v-model="confirm_password"
      />
      <div class="row align-items-center">
        <div class="col-6 text-left">
          <router-link :to="{ name: 'login' }"> Login </router-link>
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
import Helpers from '../../utils/Helpers.js';

export default {
  name: 'signup',
  data() {
    return {
      isLoading: false,
      phone: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirm_password: '',
      clearPhoneInput: false,
      countryId: '',
    };
  },
  computed: {
    isDiabled() {
      if (
        this.firstName.length < 1 ||
        this.lastName.length < 1 ||
        this.password.length < 1 ||
        this.confirm_password.length < 1
      ) {
        return true;
      }

      if (!Helpers.isValidEmail(this.email)) {
        return true;
      }

      if (this.password !== this.confirm_password) {
        return true;
      }

      return false;
    },
    countries() {
      const items = this.$store.getters.getCountries;

      if (items)
        return [{ name: '', id: '' }, ...items].map((country) => ({
          label: country.name,
          value: String(country.id),
        }));
      return [];
    },
  },
  mounted() {
    if (!this.$store.getters.getCountries) {
      this.$store.dispatch('getCountries');
    }
  },
  methods: {
    submit() {
      const data = {
        email: this.email,
        first_name: this.firstName,
        last_name: this.lastName,
        country_id: this.countryId,
        password: this.password,
      };

      this.isLoading = true;
      const url = `${process.env.VUE_APP_GEN_AUTH_SVC_URL}/auth/register`;

      if (this.password !== this.confirm_password) {
        this.$toasted.show('Passwords do not match');
        return;
      }

      if (this.countryId.trim() === '') {
        this.$toasted.show('Please select a country');
        return;
      }

      axios
        .post(url, data)
        .then((response) => {
          this.$toasted.show(response.data.message);
          this.isLoading = false;
          this.clearInput();
          localStorage.setItem('userEmail', data.email);
          this.$router.push({ name: 'email-verify-request' });
        })
        .catch((error) => {
          Helpers.errorResponse(error, (response) => {
            this.$toasted.show(response);
            this.isLoading = false;
          });
        });
    },
    clearInput() {
      this.firstName = '';
      this.lastName = '';
      this.email = '';
      this.password = '';
      this.confirm_password = '';
      this.phone = '';
      this.clearPhoneInput = true;

      setTimeout(() => {
        this.clearPhoneInput = false;
      }, 0);
    },
  },
};
</script>

<style lang="scss" scoped>
.signup {
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
