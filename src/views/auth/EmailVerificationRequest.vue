<template>
  <div class="login px-2">
    <div class="card-holder elevate">
      <div class="mb-4">
        <h1>Email verification</h1>
        <h3 class="subheading">
          An OTP has been sent to
          <span class="email">{{ email }}.</span> Please enter the OTP to
          proceed.
        </h3>
      </div>
      <tl-input
        label="OTP"
        placeholder="Enter OTP"
        v-model="otp"
        class="mb-5"
      />
      <div class="row align-items-center">
        <div class="col-6 text-left">
          <button
            @click="resendOTP"
            :disabled="otpLoading || isLoading || seconds > 0"
          >
            <icon name="loading" spin v-if="isLoading" />
            <span v-else-if="cooldown">Resend in {{ seconds }}</span>
            <span name="arrow-right" v-else>Resend OTP</span>
          </button>
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
      otpLoading: false,
      seconds: 0,
      email: '',
      otp: '',
    };
  },
  computed: {
    isDisabled() {
      if (Helpers.isEmpty(this.otp)) return true;
      return false;
    },
    cooldown() {
      if (this.seconds <= 0) return false;
      else return true;
    },
  },
  mounted() {
    this.setEmail();
  },
  methods: {
    setEmail() {
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        this.email = userEmail;
      } else {
        this.$router.push({ name: 'login' });
      }
    },
    resendOTP() {
      this.otpLoading = true;
      const url = `${process.env.VUE_APP_GEN_AUTH_SVC_URL}/auth/email-verification`;
      axios
        .post(url, {
          email: this.email,
        })
        .then(() => {
          let cooldownTime = 60;
          const x = setInterval(() => {
            this.seconds = cooldownTime;
            if (cooldownTime < 0) {
              clearInterval(x);
            } else {
              cooldownTime--;
            }
          }, 1000);

          this.$toasted.show('OTP sent successfully.');
        })
        .catch((error) => {
          Helpers.errorResponse(error, (response) => {
            this.$toasted.show(response);
          });
        })
        .finally(() => {
          this.otpLoading = false;
        });
    },
    submit() {
      this.isLoading = true;
      const url = `${process.env.VUE_APP_GEN_AUTH_SVC_URL}/auth/verify-email`;

      axios
        .post(url, {
          email: this.email,
          otp: this.otp,
        })
        .then((response) => {
          this.$toasted.show(response.data.message);
          this.$router.push({ name: 'login' });
        })
        .catch((error) => {
          Helpers.errorResponse(error, (response) => {
            this.$toasted.show(response);
          });
        })
        .finally(() => {
          this.isLoading = false;
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

  .subheading {
    margin-top: 2rem;
  }

  .email {
    color: $primary;
    font-weight: 700;
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
