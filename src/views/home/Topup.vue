<template>
  <div class="activity">
    <div class="recent-activity">
      <h2 class="mt-3 title">Fund Sendy Wallet</h2>
      <div class="recurring-cards">
        <div class="row py-3">
          <div class="col-12">
            <h3>Choose existing card</h3>
          </div>
        </div>
        <div v-if="isLoading" class="row max-w">
          <div class="col-12 text-center">
            <icon name="loading" spin primary />
          </div>
        </div>

        <div class="cards max-w">
          <credit-card
            v-for="(card, index) in cards"
            :key="index"
            :type="card.card_type"
            :last4="card.card_last4"
            :name="card.name"
            :month="card.card_exp_month"
            :year="card.card_exp_year"
            @click="showCardTopupModal(card)"
          />
        </div>
      </div>
      <div class="row my-3 max-w or">
        <div class="col-12 text-center">
          <h3>OR</h3>
        </div>
      </div>
      <div class="row max-w">
        <div class="col-12">
          <button class="btn" @click="goToTopPage">
            Direct Topup using Paystack
          </button>
        </div>
      </div>
      <p class="mt-5 text-center pt-5 max-w paragraph">
        Having your wallet funded keeps your contacts credited recurrently
      </p>
    </div>

    <tl-modal
      :name="cardTopupModalName"
      width="90%"
      :max-width="600"
      :click-to-close="false"
    >
      <div class="modal">
        <h2>Topup your wallet</h2>
        <span> How much would you like to add to your Sendy wallet?</span>

        <tl-input
          v-model="amount"
          type="number"
          label="Amount"
          placeholder="Enter amount"
        />

        <span>
          &nbsp; <br />
          <small v-if="amount.length > 0"
            ><b>{{ amountWithCharge }}</b> will be deducted because of paystack
            charges.</small
          >
        </span>

        <div class="buttons">
          <button
            class="btn"
            :disabled="amount.length < 2 || isPayLoading"
            @click="pay"
          >
            <icon
              v-if="isPayLoading"
              name="loading"
              spin
              size="0.9"
              class="mr-1"
            />Continue
          </button>
        </div>
      </div>
    </tl-modal>
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
      isPayLoading: false,
      cardTopupModalName: 'card-top-up-modal',
      currentCard: {},
      errorMessage: '',
    };
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
    cards() {
      return this.$store.getters.getCards;
    },
    canSubmit() {
      if (this.amount) return false;

      return true;
    },
    amountWithCharge() {
      return charge(Number(this.amount));
    },
  },
  mounted() {
    if (this.$store.getters.getCards.length < 1) {
      this.getCards();
    }
  },
  methods: {
    getCards() {
      this.isLoading = true;
      this.errorMessage = '';
      this.$store
        .dispatch('getCards')
        .then(() => {
          this.isLoading = false;
        })
        .catch((error) => {
          Helpers.errorResponse(error, (response) => {
            this.isLoading = false;
            this.errorMessage = response;
          });
        });
    },
    showCardTopupModal(card) {
      this.currentCard = card;
      this.$modal.show(this.cardTopupModalName);
    },
    async pay() {
      this.isPayLoading = true;

      try {
        const url = `${process.env.VUE_APP_SENDY_SVC_URL}/cards/${this.currentCard.id}/charge`;

        const response = await axios.patch(url, { amount: this.amount });
        this.amount = '';
        this.$toasted.show(response.data.message);
        this.$store.dispatch('getActivities');
        this.$modal.hide(this.cardTopupModalName);
        this.$router.push({ name: 'home' });
      } catch (error) {
        Helpers.errorResponse(error, (response) => {
          this.$toasted.show(response);
        });
      } finally {
        this.isPayLoading = false;
      }
    },
    goToTopPage() {
      this.$router.push({ name: 'directtopup' });
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
  border-radius: 20px 20px 0px 0px;
  padding-bottom: 5rem;
  .amount {
    margin-bottom: 80px;
  }
  h2 {
    font-size: 17px;
    margin-bottom: 120px;
  }

  .cards {
    padding: 20px;
    margin: 55px auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;

    @media (min-width: 768px) {
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    }
  }

  .recurring-card {
    padding: 12px 5px;
    border-radius: 5px;
    border: 1px solid #006fff;
    background-color: white;
    box-shadow: 0px 20px 80px #e5e5e5;
    display: flex;
    align-content: center;
    cursor: pointer;
    margin-bottom: 10px;

    &:last-child {
      margin-bottom: 0px;
    }
  }

  @media (min-width: 1024px) {
    .title {
      margin-top: 0 !important;
      font-size: 1.5rem;
      padding: 1rem 0;
      width: 100%;
      border-bottom: solid 1px rgba($color: #000000, $alpha: 0.1);
      margin-bottom: 0 !important;
    }

    .paragraph {
      max-width: 35ch !important;
      margin: 0 auto !important;
    }

    .recurring-cards {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
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
  }
}

.modal {
  display: grid;
  gap: 1rem;
  padding: 2rem;

  @media (max-width: 600px) {
    padding: 1rem;
  }
}

.buttons {
  display: grid;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1rem;

  &--cancel {
    background-color: transparent !important;
    border: none !important;
    color: black !important;
  }
}
</style>
