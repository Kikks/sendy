<template>
  <div class="activity">
    <div class="recent-activity">
      <div
        class="back"
        style="cursor: pointer; margin-left: -7px"
        @click="$router.push({ name: 'topup' })"
      >
        <icon name="chevron-left" primary /> Go back
      </div>
      <h2 class="mt-3 title">
        <button class="p-0 title-back" @click="$router.push({ name: 'topup' })">
          <icon name="chevron-left" size="1" />
          <span class="text">Back</span>
        </button>

        Fund Sendy Wallet
      </h2>
      <span class="heading-text">
        How much would you like to add to your Sendy wallet?</span
      >

      <tl-input
        v-model="amount"
        type="number"
        class="amount"
        placeholder="Enter Amount"
        label="Amount"
      />
      <span class="charge">
        <small v-if="amount.length > 0"
          ><b>{{ amountWithCharge }}</b> will be deducted because of paystack
          charges.</small
        >
      </span>
      <button
        class="btn mt-5 max-w"
        :disabled="amount.length < 2 || isLoading"
        @click="handlePayment"
      >
        <icon
          v-if="isLoading"
          name="loading"
          spin
          size="0.9"
          class="mr-1"
        />Continue
      </button>
      <p class="mt-5 text-center pt-5 paragraph">
        Having your wallet funded keeps your contacts credited recurrently
      </p>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import Helpers from '../../utils/Helpers';
import { charge } from '../../utils/Payment';

export default {
  data() {
    return {
      amount: '',
      isLoading: false,
    };
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
    canSubmit() {
      if (this.amount) return true;

      return false;
    },
    amountWithCharge() {
      return charge(Number(this.amount));
    },
  },
  methods: {
    async handlePayment() {
      this.isLoading = true;

      try {
        const url = `${process.env.VUE_APP_SENDY_SVC_URL}/cards/initialize`;
        const response = await axios.post(url, { amount: Number(this.amount) });
        const { authorization_url, reference } = response.data.data;

        if (authorization_url && reference) {
          localStorage.setItem('tinylabs-sendy-reference', reference);
          window.location.href = authorization_url;
        }
      } catch (error) {
        if (error.message) {
          Helpers.errorResponse(error, (res) => {
            this.$toasted.show(res);
          });
        } else this.$toasted.show('Payment service not available currently.');
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.activity {
  min-height: 100vh;
}
.recent-activity {
  padding: 20px;
  background-color: white;
  height: 800px;
  border-radius: 20px 20px 0px 0px;
  .amount {
    margin-bottom: 80px;
  }
  h2 {
    font-size: 17px;
    margin-bottom: 120px;
  }
}

.title-back {
  display: none;
}

@media (min-width: 1024px) {
  .title {
    margin-top: 0 !important;
    font-size: 1.5rem !important;
    padding: 1rem 0;
    width: 100%;
    border-bottom: solid 1px rgba($color: #000000, $alpha: 0.1);
    margin-bottom: 0 !important;
    align-self: flex-start;
    display: flex;
    align-items: center;

    &-back {
      display: inline;
      cursor: pointer;
      margin-right: 1.5rem;
      display: flex;
      align-items: center;
      transition: all 0.2s;
      color: $primary;
      font-weight: normal;

      & .text {
        font-size: 18px !important;
      }
    }
  }

  .recent-activity {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-items: center;
  }

  .back {
    display: none;
  }

  .paragraph {
    max-width: 35ch !important;
    margin: 0 auto !important;
    margin-top: 0 !important;
    padding-top: 0 !important;
    margin-bottom: auto !important;
  }

  .recurring-cards,
  .amount {
    width: 100%;
    max-width: 600px;
    margin: 0 auto !important;
    margin-bottom: 2rem !important;
  }

  .charge {
    margin-bottom: 5rem !important;
  }

  .max-w {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
  }

  .or {
    margin-top: 3rem !important;
    margin-bottom: 3rem !important;
  }

  .btn {
    margin-top: 0 !important;
    margin-bottom: 3rem !important;
  }

  .heading-text {
    margin-top: auto !important;
    margin-bottom: 3rem;
  }
}
</style>
