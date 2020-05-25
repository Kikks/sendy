<template>
  <div>
    <GreyNavbar title="Add New Contact">
      <!-- <button class="p-0" slot="trailing">
                Delete
      </button>-->
    </GreyNavbar>

    <div class="new-contact">
      <p class="text-center">Enter recipient's name, phone number and airtime frequency</p>

      <tl-input class="mt-5" placeholder="Name" v-model="name" />
      <phone-input v-model="phone" uniqueName="newcontact" />
      <tl-input class="mt-5" placeholder="Airtime Amount" type="number" v-model="amount" />
      <span v-if="airtimeMultiples !== false">
        <icon name="loading" spin class="mr-1" size="0.9" v-if="isSplitLoading" />
        <small v-if="splitErrorMessage" :style="{color: 'red'}">{{splitErrorMessage}}</small>
        <small v-else-if="splitAirtimeResult.split && splitAirtimeResult.split.length > 1">
          <p>
            Airtime will be sent in multiples of
            <b>{{splitAirtimeResult.split.join(", ")}}.</b>
          </p>
        </small>
        <small v-if="splitAirtimeResult.convert && Object.keys(splitAirtimeResult.convert).length !== 0 && !splitErrorMessage">
          <p>
            <b>Sendy's Exchange Rate</b>
          </p>
          <p>1{{splitAirtimeResult.convert.sourceCurrency}} = {{splitAirtimeResult.convert.rate}}{{splitAirtimeResult.convert.userCurrency}}</p>
          <p>{{amount}}{{splitAirtimeResult.convert.sourceCurrency}} = {{splitAirtimeResult.convert.conversion}}{{splitAirtimeResult.convert.userCurrency}}</p>
        </small>
      </span>
      <div class="row mt-4 mb-5">
        <div class="col-6">
          <date-picker
            placeholder="Start Date"
            input-class="date-picker"
            v-model="start_date"
            calendar-class="calendar-area"
            format="yyyy-MM-dd"
          ></date-picker>
        </div>
        <div class="col-6">
          <date-picker
            placeholder="End Date"
            input-class="date-picker"
            v-model="end_date"
            calendar-class="calendar-area right"
            format="yyyy-MM-dd"
            :disabled-dates="{to: new Date(start_date)}"
            :disabled="!start_date && true"
          ></date-picker>
        </div>
      </div>
      <div class="frequency mb-5">
        <div>Frequency</div>
        <div @click="changeIcon('daily')" class="freq">
          <div>Daily</div>
          <icon v-if="ticked =='daily'" name="check"></icon>
        </div>
        <div @click="changeIcon('weekly')" class="freq">
          <div>Weekly</div>
          <icon v-if="ticked =='weekly'" name="check"></icon>
        </div>
        <div @click="changeIcon('monthly')" class="freq">
          <div>Monthly</div>
          <icon v-if="ticked =='monthly'" name="check"></icon>
        </div>
      </div>
      <div class="row justify-content-space-between">
        <div class="col">Status {{ status ? '(Active)' : '(Inactive)' }}</div>
        <div class="col-6 text-right">
          <toggle-button
            v-model="status"
            :height="30"
            :width="60"
            class="ml-2"
            :color="status_color_options"
          />
        </div>
      </div>
      <button class="btn mt-5" :disabled="canSubmit || isLoading" @click="addContact">
        <icon name="loading" spin class="mr-1" size="0.9" v-if="isLoading" />Save Changes
      </button>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";
import Helpers from "../../utils/Helpers";

export default {
  data() {
    return {
      name: "",
      ticked: "daily",
      amount: "",
      phone: "",
      start_date: "",
      end_date: "",
      isLoading: false,
      isSplitLoading: false,
      status: false,
      status_color_options: {
        checked: "#4CD964",
        unchecked: "#FC001F"
      },
      splitErrorMessage: "",
      splitAirtimeResult: []
    };
  },
  computed: {
    airtimeMultiples() {
      if (this.amount && this.phone) {
        const currencyCode = Helpers.assignCurrencyCode(
          this.phone.split("-")[1]
        );
        if (currencyCode) {
          this.splitAirtime();
          return true;
        }
        return false;
      }
      return false;
    },
    canSubmit() {
      if (
        this.name.length < 1 ||
        this.phone.length < 1 ||
        this.amount.length < 1 ||
        this.splitErrorMessage ||
        this.start_date.length < 1 ||
        this.end_date.length < 1
      ) {
        return true;
      }
      return false;
    }
  },
  methods: {
    splitAirtime() {
      this.isSplitLoading = true;
      this.splitErrorMessage = "";
      const url = `${process.env.VUE_APP_SENDY_SVC_URL}/sendy/airtime/split`;
      const currencyCode = Helpers.assignCurrencyCode(this.phone.split("-")[1]);
      axios
        .post(url, { amount: Number(this.amount), currencyCode })
        .then(response => {
          this.isSplitLoading = false;
          this.splitErrorMessage = '';
          this.splitAirtimeResult = response.data.data;
        })
        .catch(error => {
          Helpers.errorResponse(error, response => {
            this.isSplitLoading = false;
            this.splitErrorMessage = response;
          });
        });
    },
    addContact() {
      if (this.isLoading) return;
      this.isLoading = true;

      const url = `${process.env.VUE_APP_SENDY_SVC_URL}/sendy/contact`;

      const currencyCode = Helpers.assignCurrencyCode(this.phone.split("-")[1]);
      const data = {
        name: this.name,
        phoneNumber: [
          {
            phoneNumber: this.phone.split("-")[0],
            amount: Number(this.amount),
            currencyCode
          }
        ],
        currencyCode,
        amount: Number(this.amount),
        startDate: moment(this.start_date).format("YYYY-MM-DD"),
        endDate: moment(this.end_date).format("YYYY-MM-DD"),
        frequency: this.ticked,
        type: "individual",
        status: this.status ? "active" : "inactive"
      };
      axios
        .post(url, data)
        .then(response => {
          this.isLoading = false;
          this.$toasted.show(response.data.message);
          this.$store.dispatch("getContacts");
          this.$router.push({ name: "contacts" });
        })
        .catch(error => {
          Helpers.errorResponse(error, response => {
            this.isLoading = false;
            this.$toasted.show(response);
          });
        });
    },
    changeIcon(data) {
      this.ticked = data;
    }
  }
};
</script>
<style lang="scss">
.new-contact {
  margin-top: 55px;
  padding: 20px;
  .freq {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #e6edff;
    color: #030039;
    font-size: 16px;
    font-weight: bold;
    height: 54px;
  }

  .date-picker {
    width: 100% !important;
    padding: 20px 0 0;
    border: none;
    border-bottom: 1px solid lightgray;
  }

  .calendar-area {
    &.right {
      right: -1vh !important;
    }

    .selected {
      background: #006fff !important;
      color: white !important;
    }
  }

  .success-state .field.vue-input-ui .lm-text-danger {
    color: green !important;
  }

  .error-state .field.vue-input-ui .lm-text-danger {
    color: red !important;
  }
}
</style>
