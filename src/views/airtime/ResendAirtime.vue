<template>
  <div>
    <GreyNavbar title="Resend Airtime"></GreyNavbar>
    <div class="resend-airtime">
      <div class="text-center" v-if="isFetchingTransaction">
        <icon name="loading" spin primary />
      </div>
      <div class="text-center" v-if="errorMessage">
        <span>{{errorMessage}}</span>
      </div>
      <div v-if="!isFetchingTransaction && !errorMessage && phones.length > 0">
        <div
          class="row align-items-center mt-4"
          v-for="(phone, index) in slicedPhones"
          :key="phone.id"
        >
          <div class="row align-items-center mt-4" v-for="item in phone" :key="item.id">
            <div class="col-1 text-center">
              <icon
                name="delete"
                color="red"
                @click.native="deleteNumber(index)"
                v-if="phones.length > 1"
              />
            </div>
            <div class="col-11">
              <phone-input
                v-model="item.value"
                :uniqueName="`group-contact-${item.id}`"
                :defaultCountryCode="defaultCode"
                :onlyCountries="onlyCountryCodes"
                customStyle="margin-top: 0.25rem !important"
              />
            </div>
          </div>
        </div>
        <div class="row pt-3 align-items-center" v-if="uploadedCSV">
          <div
            class="col"
            @click="visible = visible > 1 ? visible - 1 : visible"
            v-if="!(visible < 2)"
          >
            <center>
              <small>Show Less.</small>
            </center>
          </div>
          <div
            class="col"
            @click="visible = visible * 5 >= phones.length ? visible : visible + 1"
            v-if="!(visible * 5 >= phones.length)"
          >
            <center>
              <small>Show More.</small>
            </center>
          </div>
        </div>
        <div class="row pt-3 align-items-center" v-if="uploadedCSV">
          <div class="col">
            <center>
              <small>{{slicedPhones.reduce((acc,element) => acc + element.length, 0)}} of {{phones.length}}</small>
            </center>
          </div>
        </div>
        <button class="btn mt-5" :disabled="canSubmit || isLoading" @click="resendAirtime">
          <icon name="loading" spin class="mr-1" size="0.9" v-if="isLoading" />Resend
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";
import Helpers from "../../utils/Helpers";
import countries_code from "../../country_code.json";

export default {
  data() {
    return {
      visible: 1,
      amount: "",
      phones: [],
      isLoading: false,
      isFetchingTransaction: false,
      uploadedCSV: false,
      errorMessage: "",
      countriesCode: countries_code,
      defaultCode: "NG"
    };
  },
  computed: {
    onlyCountryCodes() {
      if (this.phones.length < 2) {
        return this.countriesCode;
      }
      return this.countriesCode.filter(cc => cc == this.defaultCode);
    },
    slicedPhones() {
      let slicedPhones = [];
      for (let i = 0; i < this.visible; i++) {
        slicedPhones.push(this.phones.slice(i * 5, i * 5 + 5));
      }
      if (this.phones.length > 5) this.uploadedCSV = true;
      return slicedPhones;
    },
    refinedPhoneNumbers() {
      let refinedArray = [];
      this.phones.forEach(phone => {
        refinedArray.push(phone.value.split("-")[0]);
      });
      return refinedArray.filter(
        (phone, index) => refinedArray.indexOf(phone) === index
      );
    },
    canSubmit() {
      if (
        !this.phones[this.phones.length - 1].value
      ) {
        return true;
      }
      return false;
    },
  },
  mounted() {
    this.getTransaction();
  },
  methods: {
    getTransaction() {
      if (this.isFetchingTransaction) return;
      this.isFetchingTransaction = true;
      this.errorMessage = "";
      const transactionId = this.$route.params.id;
      const url = `${process.env.VUE_APP_SENDY_SVC_URL}/sendy/transaction/${transactionId}`;
      axios
        .get(url)
        .then(response => {
          this.isFetchingTransaction = false;
          this.setTransaction(response.data.data);
        })
        .catch(error => {
          Helpers.errorResponse(error, response => {
            this.isFetchingTransaction = false;
            this.errorMessage = response;
            this.$toasted.show(response);
          });
        });
    },
    setTransaction(transaction) {
      transaction.failedPhoneNumber.forEach(phone => {
        this.phones.push({
          id: Math.random(),
          value: phone.phoneNumber
        });
      });
      this.defaultCode = transaction.failedPhoneNumber[0].currencyCode.substring(0, transaction.failedPhoneNumber[0].currencyCode.length - 1)
      this.amount = String(transaction.failedPhoneNumber[0].amount);
      this.transaction = transaction;
    },
    resendAirtime() {
      if (this.isLoading) return;
      this.isLoading = true;

      const url = `${process.env.VUE_APP_SENDY_SVC_URL}/sendy/airtime`;
      const currencyCode = Helpers.assignCurrencyCode(this.defaultCode);
      const airtimeAmount = this.amount;
      const options = this.refinedPhoneNumbers.map(function(element) {
        const newData = {};
        newData.amount = Number(airtimeAmount);
        newData.phoneNumber = element;
        newData.currencyCode = currencyCode;
        return newData;
      });
      const data = {
        transaction: this.transaction.id,
        failedPhoneNumber: options || [],
        category: "resendFailedAirtime",
      };

      axios
        .post(url, data)
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
    },
  }
};
</script>
<style lang="scss">
.resend-airtime {
  margin-top: 55px;
  padding: 20px;
}
</style>
