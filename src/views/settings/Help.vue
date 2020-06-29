<template>
  <div>
    <GreyNavbar title="Help" />

    <div class="help">
      <div class="options">
        <div class="row py-3">
          <div class="col-12">
            <p
              class="text-center mt-1 mb-5"
            >Find help to some of your account issues. Fix an unresolved wallet top up transaction and contact us for further assistance</p>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="option" @click="showFixTransactionModal()">Fix Transaction</div>
            <div class="option" @click="email()">Email Us</div>
            <div class="option" @click="call()">Call Us</div>
          </div>
        </div>
      </div>
    </div>
    <tl-modal :name="fixTransactionModalName" :clickToClose="false">
      <div class="row justify-content-center">
        <div class="col-10">
          <h2>Fix a Transaction</h2>
          <p class>Enter your transaction reference from Paystack</p>
          <tl-input
            class="transaction"
            type="text"
            placeholder="Enter Reference"
            v-model="reference"
          />
          <button class="btn mt-5" :disabled="reference.length < 1 || isLoading" @click="referencePayment">
            <icon name="loading" spin size="0.9" class="mr-1" v-if="isLoading" />Continue
          </button>
        </div>
      </div>
    </tl-modal>
  </div>
</template>

<script>
import axios from "axios";
import Helpers from "../../utils/Helpers";

export default {
  data() {
    return {
      reference: "",
      fixTransactionModalName: "fix-transaction-modal",
      isLoading: false,
      errorMessage: ""
    };
  },
  computed: {
    canSubmit() {
      if (
        typeof this.notification === "boolean" &&
        this.threshold >= 0 &&
        this.threshold
      ) {
        return false;
      }
      return true;
    },
    user() {
      return this.$store.getters.getUser;
    }
  },
  methods: {
    showFixTransactionModal() {
      this.$modal.show(this.fixTransactionModalName);
    },
    email() {
      window.open('mailto:hello@tinylabs.app', '_blank');
    },
    call() {
      window.open('tel:+2348120789740', '_blank');
    },
    referencePayment() {
      this.isLoading = true;
      const url = `${process.env.VUE_APP_SENDY_SVC_URL}/sendy/payment`;
      axios
        .post(url, {
          reference: this.reference
        })
        .then(response => {
          this.isLoading = false;
          this.$toasted.show(response.data.message);
          this.$store.dispatch("getActivities");
          this.$router.push({ name: "home" });
        })
        .catch(error => {
          Helpers.errorResponse(error, response => {
            this.isLoading = false;
            this.$toasted.show(response);
          });
        });
    }
  },
  mounted() {
    this.getAlertInfo();
  }
};
</script>
<style lang="scss" scoped>
.help {
  margin-top: 55px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 80vh;

  .option {
    justify-content: center;
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
}
</style>