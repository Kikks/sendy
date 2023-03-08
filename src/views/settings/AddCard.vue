<template>
  <div class="main">
    <SideNav />

    <div class="content">
      <GreyNavbar title="Add Card" />

      <div class="add-card">
        <tl-input
          v-model="amount"
          class="amount"
          placeholder="Enter Amount"
          type="number"
        />
        <p class="mb-5">This will be funded to your account.</p>
        <button
          class="btn mt-5"
          :disabled="amount.length < 2 || isLoading"
          @click="addCard"
        >
          <icon v-if="isLoading" name="loading" spin size="0.9" class="mr-2" />
          Save Card
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Pay from '../../utils/Payment.js';
import Helpers from '../../utils/Helpers';
import SideNav from '../../components/SideNav.vue';

export default {
  components: { SideNav },
  data() {
    return {
      amount: '10',
      isLoading: false,
    };
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
  },
  methods: {
    addCard() {
      this.$loadScript('https://js.paystack.co/v1/inline.js')
        .then(() => {
          new Pay({
            amount: this.amount,
            email: this.user.email,
            user: this.user.id,
          }).initiatePayment(this.referencePayment);
        })
        .catch(() => {
          this.$toasted.show('Payment service not available currently.');
        });
    },
    referencePayment(response) {
      this.isLoading = true;
      const url = `${process.env.VUE_APP_SENDY_SVC_URL}/sendy/payment`;
      axios
        .post(url, {
          reference: response.reference,
        })
        .then((res) => {
          this.isLoading = false;
          this.amount = '';

          this.$store.dispatch('getActivities');
          this.$store.dispatch('getCards');

          if (
            res.data &&
            res.data.authorization &&
            !res.data.authorization.reusable
          ) {
            this.$toasted.show('Card is not reusable');
            this.$router.push({ name: 'topup' });
            return;
          }

          this.$toasted.show('Card added successfully');
          this.$router.push({ name: 'topup' });
        })
        .catch((error) => {
          Helpers.errorResponse(error, (res) => {
            this.isLoading = false;
            this.$toasted.show(res);
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.add-card {
  padding: 20px;
  // display: flex;
  // flex-direction: column;
  //justify-content: space-between;
  min-height: 50vh;
  max-width: 700px;
  margin: 55px auto;
}

.main {
  width: 100%;
  height: 100%;
  min-height: 100vh;

  @media (min-width: 1024px) {
    height: 100vh;
    display: flex;
    overflow-y: hidden;
  }
}

.content {
  @media (min-width: 1024px) {
    min-height: 100vh;
    flex: 1;
    overflow-y: auto;
  }
}
</style>
