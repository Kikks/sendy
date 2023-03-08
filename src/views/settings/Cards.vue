<template>
  <div class="main">
    <SideNav />

    <div class="content">
      <GreyNavbar title="Cards">
        <template #trailing>
          <div class="col text-right">
            <button
              class="addBtn"
              :disabled="isLoading"
              @click="handleShowModal()"
            >
              <span class="small-screen-label">+ New</span>
              <span class="large-screen-label">+ Add New</span>
            </button>
          </div>
        </template>
      </GreyNavbar>

      <div v-if="isLoading" class="loader">
        <icon name="loading" spin primary />
      </div>

      <div v-else-if="cards.length === 0" class="empty-container">
        <p>You have not added any card yet.</p>
        <button class="btn" :disabled="isLoading" @click="handleShowModal()">
          Add Card
        </button>
      </div>

      <div v-else class="cards">
        <credit-card
          v-for="(card, index) in cards"
          :key="index"
          :type="card.card_type"
          :last4="card.card_last4"
          :name="card.name"
          :month="card.card_exp_month"
          :year="card.card_exp_year"
        />
      </div>
    </div>

    <tl-modal :name="modal" width="90%" :max-width="600">
      <div class="modal">
        <h2>Add New Card</h2>
        <span> How much would you like to add to your Sendy wallet?</span>

        <tl-input
          v-model="amount"
          type="number"
          label="Amount"
          placeholder="Enter amount"
        />

        <div class="buttons">
          <button class="btn small btn--cancel" @click="handleHideModal">
            Cancel
          </button>

          <button
            class="btn small btn--main"
            :disabled="isLoading"
            @click="addNewCard"
          >
            <icon v-if="isLoading" name="loading" spin size="0.7" />
            Add
          </button>
        </div>
      </div>
    </tl-modal>
  </div>
</template>

<script>
import axios from 'axios';
import Helpers from '../../utils/Helpers';
import SideNav from '../../components/SideNav.vue';

export default {
  components: { SideNav },
  data() {
    return {
      amount: '',
      isLoading: false,
      showPaymentModal: false,
      modal: 'add-card-modal',
    };
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
    paginationMetaData() {
      return this.$store.getters.getPaginationMetaData;
    },
    cards() {
      return this.$store.getters.getCards;
    },
  },
  mounted() {
    const reference = localStorage.getItem('tinylabs-sendy-reference');

    if (reference) {
      this.handleVerifyCard(reference);
    } else if (this.$store.getters.getCards.length < 1) {
      this.getCards();
    }
  },
  methods: {
    getCards(page = 1) {
      this.isLoading = true;
      this.$store
        .dispatch('getCards', { page })
        .then((response) => {
          this.isLoading = false;
          this.$store.commit(
            'setPaginationMetaData',
            response.data.data.page_info
          );
        })
        .catch((error) => {
          Helpers.errorResponse(error, (response) => {
            this.isLoading = false;
            this.errorMessage = response;
          });
        });
    },
    handleShowModal() {
      this.$modal.show(this.modal);
    },
    handleHideModal() {
      this.$modal.hide(this.modal);
    },
    async addNewCard() {
      this.isLoading = true;

      try {
        const url = `${process.env.VUE_APP_SENDY_SVC_URL}/cards/initialize`;
        const response = await axios.post(url, { amount: Number(this.amount) });
        const { authorization_url, reference } = response.data.data;

        if (authorization_url && reference) {
          localStorage.setItem('tinylabs-sendy-reference', reference);
          this.handleHideModal();
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
    async handleVerifyCard(reference) {
      this.isLoading = true;

      try {
        const url = `${process.env.VUE_APP_SENDY_SVC_URL}/cards`;
        await axios.post(url, { reference });
      } catch (error) {
        if (error.message) {
          Helpers.errorResponse(error, (res) => {
            this.$toasted.show(res);
          });
        } else this.$toasted.show('Could not verify your payment.');
      } finally {
        localStorage.removeItem('tinylabs-sendy-reference');
        this.isLoading = false;
        this.getCards();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
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

.empty-container {
  padding: 20px;
  width: 100%;
  max-width: 400px;
  margin: auto;
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  text-align: center;
}

.loader {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  min-height: 80vh;
  display: grid;
  place-items: center;
  text-align: center;
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

.addBtn {
  color: $primary;
  font-weight: normal;
}

.small-screen-label {
  display: inline;

  @media (min-width: 768px) {
    display: none;
  }
}

.large-screen-label {
  display: none;

  @media (min-width: 768px) {
    display: inline;
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
  grid-template-columns: repeat(2, 1fr);
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
