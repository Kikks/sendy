<template>
  <div>
    <GreyNavbar title="Send Airtime" />

    <div class="send-airtime">
      <h3>
        <b>Select Categories</b>
      </h3>

      <div class="switcher mt-3">
        <div @click="tab=true" class="switch" :class="tab && 'active'">New Recipient</div>
        <div @click="tab=false" class="switch" :class="!tab && 'active'">Saved Recipients</div>
      </div>
      <div v-if="tab">
        <tl-input class="mt-5" placeholder="Name" v-model="name" />

        <div v-for="(phone, index) in slicedPhones" :key="phone.id">
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
        <div class="row pt-3 justify-content-end align-items-center">
          <div class="col-4" v-if="phones.length <= 1">
            <a
              href="https://docs.google.com/spreadsheets/d/156CT5kfJRuTgPCuyuJv8TNTDR7bAUl21H6tpPAunhBw/edit#gid=0"
              download
              class="btn small link"
              style="padding: 0 1px 0 1px;"
            >
              <small>Download CSV format.</small>
            </a>
          </div>
          <div class="col-4" v-if="phones.length <= 1">
            <div class="upload-csv-section" @click="$refs.CSVFileUpload.click()">
              <span class>
                {{ uploadedFileNameTextFormat ? uploadedFileNameTextFormat : '+ Upload CSV' }}
                <icon v-if="isUploadingCSV" name="loading" spin size="0.7" />
              </span>
              <input type="file" ref="CSVFileUpload" @change="handlePhoneCSVUpload" />
            </div>
          </div>

          <!-- <p class="text-center">Show More</p>
          <p class="text-center">Show Less</p>-->
          <div class="col-3">
            <button
              class="btn small"
              :disabled="!phones[phones.length - 1].value"
              @click="createNewPhoneNumber()"
              style="padding: 0 1px 0 1px;"
            >
              <icon name="plus" />
            </button>
          </div>
        </div>

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

        <br />
        <br />
        <div class="row justify-content-space-between">
          <div class="col">Save Contact</div>
          <div class="col-6 text-right">
            <toggle-button
              v-model="saveContact"
              :height="30"
              :width="60"
              class="ml-2"
              :color="status_color_options"
            />
          </div>
        </div>
        <div v-if="saveContact">
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
        </div>
      </div>
      <div v-else style="position: relative;">
        <tl-input
          class="mt-5"
          v-model="searchTerm"
          placeholder="Search Recipient"
          icon="magnify"
          type="text"
          key="searchTerm"
        />
        <div class="search" v-if="shouldShowSearchBox">
          <div class="searchbox px-3 pb-3" v-on-clickaway="away">
            <div
              class="row pt-3"
              v-if="!isSearchLoading && !searchErrorMessage && searchContactResult.length < 1"
            >
              <div class="col-12">Not found</div>
            </div>
            <div class="row pt-3" v-if="searchErrorMessage">
              <div class="col-12">{{ searchErrorMessage }}</div>
            </div>
            <div class="row pt-3" v-if="isSearchLoading">
              <div class="col-12">Searching...</div>
            </div>
            <div
              class="searchitem pt-3"
              v-for="(contact) in searchContactResult"
              :key="contact.id"
              @click="selectContact(contact)"
            >
              <div class="row">
                <div class="col-6">{{contact.name}}</div>
                <div class="col-6 text-right">{{contact.currencyCode}}{{contact.amount}}</div>
              </div>
              <div class="row searchrow">
                <div class="col-6">{{contact.phoneNumber[0].phoneNumber}}</div>
                <div class="col-6 text-right">{{contact.frequency}}</div>
              </div>
            </div>
          </div>
        </div>
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
      </div>

      <button
        class="btn mt-5"
        :disabled="canSubmit || isLoading"
        @click="saveContact ? addContact() : transfer()"
      >
        <icon name="loading" spin size="0.9" class="mr-1" v-if="isLoading" />Transfer
      </button>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";
import { directive as onClickaway } from "vue-clickaway";
import Helpers from "../../utils/Helpers.js";
import countries_code from "../../country_code.json";

export default {
  directives: {
    onClickaway: onClickaway
  },
  data() {
    return {
      tab: true,
      searchTerm: "",
      name: "",
      ticked: "daily",
      amount: "",
      start_date: "",
      end_date: "",
      isLoading: false,
      isSplitLoading: false,
      isSearchLoading: false,
      selectedContactId: "",
      showSearch: false,
      visible: 1,
      phones: [{ id: 1, value: "" }],
      status: false,
      saveContact: false,
      status_color_options: {
        checked: "#4CD964",
        unchecked: "#FC001F"
      },
      searchContactResult: [],
      splitAirtimeResult: [],
      searchErrorMessage: "",
      splitErrorMessage: "",
      isUploadingCSV: false,
      uploadedCSV: false,
      defaultCode: "NG",
      currencyCode: "",
      currentFileUploadName: "",
      countriesCode: countries_code
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
    shouldShowSearchBox() {
      if (this.showSearch && this.searchTerm.length > 0) {
        return true;
      }
      return false;
    },
    airtimeMultiples() {
      if (this.amount) {
        if (this.tab && this.phones[this.phones.length - 1].value) {
          this.currencyCode = this.phones[this.phones.length - 1].value.split(
            "-"
          )[1];
          this.splitAirtime();
          return true;
        }
        if (!this.tab && this.selectedContactId.length > 1) {
          this.splitAirtime();
          return true;
        }
        return false;
      }
      return false;
    },
    canSubmit() {
      if (this.saveContact) {
        if (
          this.name.length < 1 ||
          this.amount.length < 1 ||
          this.splitErrorMessage ||
          this.start_date.length < 1 ||
          this.end_date.length < 1 ||
          !this.phones[this.phones.length - 1].value
        ) {
          return true;
        }
        return false;
      }
      if (this.tab && this.name.length < 1) {
        return true;
      }

      if (this.tab && !this.phones[this.phones.length - 1].value) {
        return true;
      }

      if (!this.tab && this.selectedContactId.length < 1) {
        return true;
      }

      if (this.amount < 1 || this.splitErrorMessage) {
        return true;
      }

      return false;
    },
    uploadedFileNameTextFormat() {
      if (!this.currentFileUploadName) {
        return "";
      }
      return (
        this.currentFileUploadName.substring(0, 5) +
        "..." +
        this.currentFileUploadName.substring(
          this.currentFileUploadName.length - 4
        )
      );
    }
  },
  watch: {
    searchContactResult(newValue) {
      if (newValue.length < 1) {
        this.selectedContactId = "";
      }
    },
    searchTerm(v) {
      if (v.length > 0) {
        this.search(v);
        this.showSearch = true;
      }
    }
  },
  methods: {
    search(query) {
      this.isSearchLoading = true;
      this.searchErrorMessage = "";

      const url = `${process.env.VUE_APP_SENDY_SVC_URL}/sendy/contact/search`;

      axios
        .post(url, { query })
        .then(response => {
          this.searchContactResult = response.data.data;
          this.isSearchLoading = false;
        })
        .catch(error => {
          Helpers.errorResponse(error, response => {
            this.isSearchLoading = false;
            this.searchErrorMessage = response;
          });
        });
    },
    splitAirtime() {
      this.isSplitLoading = true;
      this.splitErrorMessage = "";
      const url = `${process.env.VUE_APP_SENDY_SVC_URL}/sendy/airtime/split`;
      let data = { amount: Number(this.amount) };
      if (this.tab) {
        const currencyCode = Helpers.assignCurrencyCode(this.currencyCode);

        data.currencyCode = currencyCode;
      } else {
        data.contact = this.selectedContactId;
      }
      axios
        .post(url, data)
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
    handlePhoneCSVUpload(e) {
      let fileElement = e.target;

      let fileObject = fileElement.files[0];

      this.currentFileUploadName = fileObject.name;

      if (fileObject.size > 1097152) {
        this.$toasted.show("CSV file size is too large.");
        this.currentFileUploadName = "";
        fileElement.value = "";
        return;
      }

      const fileExtenstionSplit = fileObject.name.split(".");
      const fileExtenstion =
        fileExtenstionSplit[fileExtenstionSplit.length - 1];

      if (fileExtenstion !== "csv") {
        this.$toasted.show("Only CSV files allowed");
        this.currentFileUploadName = "";
        fileElement.value = "";
        return;
      }

      this.uploadPhoneCsv(fileObject);
    },
    uploadPhoneCsv(fileObject) {
      this.isUploadingCSV = true;
      const url = `https://api.foodjaar.com/csv`;

      let uploadCSVFormData = new FormData();
      uploadCSVFormData.append("csv", fileObject);
      axios
        .post(url, uploadCSVFormData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          this.setPhoneNumbers(response.data.data);
          this.isUploadingCSV = false;
        })
        .catch(error => {
          Helpers.errorResponse(error, response => {
            this.isUploadingCSV = false;
            this.$toasted.show(response);
          });
        });
    },
    setPhoneNumbers(phones) {
      const numbers = [];
      phones.forEach(phone => {
        for (let key in phone) {
          numbers.push({ id: Math.random(), value: phone[key] });
        }
      });
      this.phones = numbers;
    },
    createNewPhoneNumber() {
      if (!this.phones[this.phones.length - 1].value) {
        return;
      }

      this.defaultCode = this.phones[this.phones.length - 1].value.split(
        "-"
      )[1];
      this.phones.push({
        value: "",
        id: Math.random()
      });
      this.visible =
        this.visible * 5 >= this.phones.length
          ? this.visible
          : this.visible + 1;
    },
    deleteNumber(index) {
      this.phones.splice(index, 1);
    },
    away() {
      this.searchTerm = "";
      this.showSearch = false;
    },
    changeIcon(data) {
      this.ticked = data;
    },
    selectContact(contact) {
      this.searchTerm = contact.name;
      this.selectedContactId = contact.id;
      setTimeout(() => {
        this.showSearch = false;
      }, 0);
    },
    transfer() {
      if (this.isLoading) return;

      const url = `${process.env.VUE_APP_SENDY_SVC_URL}/sendy/airtime`;

      this.isLoading = true;
      this.defaultCode = this.phones[this.phones.length - 1].value.split(
        "-"
      )[1];
      const currencyCode = Helpers.assignCurrencyCode(this.defaultCode);

      const data = {
        category: this.tab ? "newRecipient" : "savedRecipient",
        currencyCode,
      };
      const airtimeAmount = this.amount;
      if (this.tab) {
        data.options = this.refinedPhoneNumbers.map(function(element) {
          const newData = {};
          newData.amount = Number(airtimeAmount);
          newData.phoneNumber = element;
          newData.currencyCode = currencyCode;
          return newData;
        });
        data.name = this.name;
      } else {
        data.contact = this.selectedContactId;
        data.amount = Number(this.amount);
      }
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
    addContact() {
      if (this.isLoading) return;
      this.isLoading = true;

      const url = `${process.env.VUE_APP_SENDY_SVC_URL}/sendy/contact`;
      this.defaultCode = this.phones[this.phones.length - 1].value.split(
        "-"
      )[1];
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
        name: this.name,
        phoneNumber: options,
        currencyCode,
        amount: Number(this.amount),
        startDate: moment(this.start_date).format("YYYY-MM-DD"),
        endDate: moment(this.end_date).format("YYYY-MM-DD"),
        frequency: this.ticked,
        type: options.length > 1 ? "group" : "individual",
        status: this.status ? "active" : "inactive"
      };
      axios
        .post(url, data)
        .then(response => {
          this.isLoading = false;
          this.$toasted.show(response.data.message);
          if (response.data.data) {
            setTimeout(this.$toasted.clear(), 10000);
            return this.transfer();
          }
        })
        .catch(error => {
          Helpers.errorResponse(error, response => {
            this.isLoading = false;
            this.$toasted.show(response);
          });
        });
    }
  }
};
</script>

<style lang="scss">
.send-airtime {
  margin-top: 55px;
  padding: 20px;

  .date-picker {
    width: 100% !important;
    padding: 20px 0 0;
    border: none;
    border-bottom: 1px solid lightgray;
  }
  .switcher {
    border: 1px solid $primary;
    border-radius: 5px;
    text-align: center;
    display: flex;

    .switch {
      flex: 1;
      padding: 4px 0;
      color: $primary;
      font-size: 16px;
    }
    .active {
      background-color: $primary;
      color: #ffffff;
      //    border:1px solid blue;
      // border-radius:5px;
    }
  }
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

  .calendar-area {
    &.right {
      right: -1vh !important;
    }

    .selected {
      background: #006fff !important;
      color: white !important;
    }
  }
  .fixedbtn {
    position: fixed;
    top: 680px;
    left: 3.5px;
    width: 98%;
  }
  .search {
    position: absolute;
    width: 100%;
    // max-width: calc($full-width - 10px);
    max-width: $full-width;
    z-index: 1;
  }
  .upload-csv-section {
    background: #e6edff;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;

    span {
      font-size: 12px;
      color: $text-color;
    }

    input[type="file"] {
      display: none;
    }
  }
  .searchbox {
    width: 100%;
    max-width: $full-width;
    height: auto;
    background: #ffffff;
    box-shadow: 0px 20px 50px #e9edee;
    border-radius: 0px 0px 10px 10px;
    overflow-y: scroll;

    .searchitem {
      border-bottom: 1px solid#E6EDFF;
      &:last-child {
        border-bottom: none;
      }
    }

    .searchrow {
      color: #d2d5db;
      font-size: 14px;
    }
  }
}
</style>