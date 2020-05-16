<template>
  <div>
    <GreyNavbar title="Add New Contact">
      <!-- <button class="p-0" slot="trailing">Delete</button> -->
    </GreyNavbar>

    <div class="new-contact">
      <p class="text-center">Enter group name, phone numbers and airtime frequency</p>

      <tl-input class="mt-5" placeholder="Group Name" v-model="groupName" />
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
        &nbsp;
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
            v-model="startDate"
            calendar-class="calendar-area"
            format="yyyy-MM-dd"
          ></date-picker>
        </div>
        <div class="col-6">
          <date-picker
            placeholder="End Date"
            input-class="date-picker"
            v-model="endDate"
            calendar-class="calendar-area right"
            format="yyyy-MM-dd"
            :disabled-dates="{to: new Date(startDate)}"
            :disabled="!startDate && true"
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

      <button class="btn mt-5" :disabled="canSubmit || isLoading" @click="addGroupContact">
        <icon name="loading" spin v-if="isLoading" class="mr-2" size="0.9" />Save Changes
      </button>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";
import Helpers from "../../utils/Helpers.js";
import countries_code from "../../country_code.json";

export default {
  data() {
    return {
      groupName: "",
      ticked: "daily",
      visible: 1,
      phones: [{ id: 1, value: "" }],
      amount: "",
      maxAirtime: 20000,
      startDate: "",
      endDate: "",
      status: true,
      status_color_options: {
        checked: "#4CD964",
        unchecked: "#FC001F"
      },
      countriesCode: countries_code,
      isLoading: false,
      isUploadingCSV: false,
      uploadedCSV: false,
      defaultCode: "NG",
      currencyCode: "",
      currentFileUploadName: "",
      splitAirtimeResult: [],
      splitErrorMessage: ""
    };
  },
  computed: {
    onlyCountryCodes() {
      if (this.phones.length < 2) {
        return this.countriesCode;
      }
      return this.countriesCode.filter(cc => cc == this.defaultCode);
    },
    airtimeMultiples() {
      if (this.amount && this.phones[this.phones.length - 1].value) {
        this.currencyCode = this.phones[this.phones.length - 1].value.split(
          "-"
        )[1];
        if (this.currencyCode) {
          this.splitAirtime();
          return true;
        }
        return false;
      }
      return false;
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
        this.groupName.length < 1 ||
        this.amount.length < 1 ||
        this.splitErrorMessage ||
        this.startDate.length < 1 ||
        this.endDate.length < 1 ||
        !this.phones[this.phones.length - 1].value
      ) {
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
  methods: {
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
      const url = `${process.env.VUE_APP_SENDY_SVC_URL}/sendy/contact/csv`;

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
    changeIcon(data) {
      this.ticked = data;
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
    splitAirtime() {
      this.splitErrorMessage = "";
      const url = `${process.env.VUE_APP_SENDY_SVC_URL}/sendy/airtime/split`;
      const currencyCode = Helpers.assignCurrencyCode(this.currencyCode);
      axios
        .post(url, { amount: Number(this.amount), currencyCode })
        .then(response => {
          this.splitAirtimeResult = response.data.data;
        })
        .catch(error => {
          Helpers.errorResponse(error, response => {
            this.splitErrorMessage = response;
          });
        });
    },
    addGroupContact() {
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
        name: this.groupName,
        phoneNumber: options,
        currencyCode,
        amount: Number(this.amount),
        startDate: moment(this.startDate).format("YYYY-MM-DD"),
        endDate: moment(this.endDate).format("YYYY-MM-DD"),
        frequency: this.ticked,
        type: "group",
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
    deleteNumber(index) {
      this.phones.splice(index, 1);
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

  .new-contact-phone-input {
    &:nth-child(1) {
      margin-top: 0px !important;
      //background: red;
    }
  }
  .add-phone-number-icon {
    cursor: pointer;
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
}
</style>
