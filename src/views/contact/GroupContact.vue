<!-- eslint-disable prefer-destructuring -->
<template>
  <div class="main">
    <SideNav />

    <div class="content">
      <GreyNavbar title="Add New Contact">
        <!-- <button class="p-0" slot="trailing">Delete</button> -->
      </GreyNavbar>

      <div class="new-contact">
        <p class="text-center">
          Enter name, phone numbers and airtime frequency
        </p>

        <tl-input
          v-model="groupName"
          class="mt-5"
          label="Contact Name"
          placeholder="Contact Name"
        />

        <div v-for="(phone, index) in slicedPhones" :key="phone.id">
          <div
            v-for="item in phone"
            :key="item.id"
            class="row align-items-center mt-4"
          >
            <div class="col-1 text-center">
              <icon
                v-if="phones.length > 1"
                name="delete"
                color="red"
                class="icon-btn"
                @click.native="deleteNumber(index)"
              />
            </div>
            <div
              class="col-11"
              :class="phones.length > 1 ? 'col-11' : 'col-12'"
            >
              <phone-input
                v-model="item.value"
                :unique-name="`group-contact-${item.id}`"
                :default-country-code="defaultCode"
                :only-countries="onlyCountryCodes"
                custom-style="margin-top: 0.25rem !important"
              />
            </div>
          </div>
        </div>

        <div class="row pt-3 justify-content-end align-items-center">
          <div class="col-3">
            <button
              class="btn small"
              :disabled="!phones[phones.length - 1].value"
              style="padding: 0 1px 0 1px"
              @click="createNewPhoneNumber()"
            >
              <icon name="plus" />
            </button>
          </div>
        </div>

        <tl-input
          v-model="amount"
          label="Airtime Amount"
          placeholder="Airtime Amount"
          type="number"
        />

        <div class="row mt-4 mb-5">
          <div class="col-6">
            <date-picker
              v-model="startDate"
              placeholder="Start Date"
              input-class="date-picker"
              calendar-class="calendar-area"
              format="yyyy-MM-dd"
              :disabled-dates="{
                to: new Date(),
              }"
            />
          </div>
          <div class="col-6">
            <date-picker
              v-model="endDate"
              placeholder="End Date"
              input-class="date-picker"
              calendar-class="calendar-area right"
              format="yyyy-MM-dd"
              :disabled-dates="{ to: new Date(startDate) }"
              :disabled="!startDate && true"
            />
          </div>
        </div>

        <div class="frequency mb-5">
          <div>Frequency</div>
          <div class="freq" @click="changeIcon('daily')">
            <div>Daily</div>
            <icon v-if="ticked == 'daily'" name="check"></icon>
          </div>
          <div class="freq" @click="changeIcon('weekly')">
            <div>Weekly</div>
            <icon v-if="ticked == 'weekly'" name="check"></icon>
          </div>
          <div class="freq" @click="changeIcon('monthly')">
            <div>Monthly</div>
            <icon v-if="ticked == 'monthly'" name="check"></icon>
          </div>
        </div>

        <div class="row justify-content-space-between">
          <div class="col">Scheduled</div>
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

        <button
          class="btn mt-5"
          :disabled="!canSubmit || isLoading"
          @click="addGroupContact"
        >
          <icon
            v-if="isLoading"
            name="loading"
            spin
            class="mr-2"
            size="0.9"
          />Save Changes
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import moment from 'moment';
import Helpers from '../../utils/Helpers.js';
import countries_code from '../../country_code.json';
import SideNav from '../../components/SideNav.vue';

export default {
  components: { SideNav },
  data() {
    return {
      groupName: '',
      ticked: 'daily',
      visible: 1,
      phones: [{ id: 1, value: '' }],
      amount: '',
      maxAirtime: 20000,
      startDate: '',
      endDate: '',
      status: true,
      status_color_options: {
        checked: '#4CD964',
        unchecked: '#FC001F',
      },
      countriesCode: countries_code,
      isLoading: false,
      isSplitLoading: false,
      isUploadingCSV: false,
      uploadedCSV: false,
      defaultCode: 'NG',
      currencyCode: '',
      currentFileUploadName: '',
      splitAirtimeResult: [],
      splitErrorMessage: '',
    };
  },
  computed: {
    onlyCountryCodes() {
      if (this.phones.length < 2) {
        return this.countriesCode;
      }
      return this.countriesCode.filter((cc) => cc === this.defaultCode);
    },
    airtimeMultiples() {
      if (this.amount && this.phones[this.phones.length - 1].value) {
        this.currencyCode =
          this.phones[this.phones.length - 1].value.split('-')[1];
        if (this.currencyCode) {
          this.splitAirtime();
          return true;
        }
        return false;
      }
      return false;
    },
    slicedPhones() {
      const slicedPhones = [];
      for (let i = 0; i < this.visible; i++) {
        slicedPhones.push(this.phones.slice(i * 5, i * 5 + 5));
      }
      if (this.phones.length > 5) this.uploadedCSV = true;
      return slicedPhones;
    },
    refinedPhoneNumbers() {
      const refinedArray = [];
      this.phones.forEach((phone) => {
        refinedArray.push(phone.value.split('-')[0]);
      });
      return refinedArray.filter(
        (phone, index) => refinedArray.indexOf(phone) === index
      );
    },
    canSubmit() {
      if (
        this.groupName.length < 1 ||
        this.amount.length < 1 ||
        this.startDate.length < 1 ||
        this.endDate.length < 1 ||
        !this.phones[this.phones.length - 1].value
      ) {
        return false;
      }
      return true;
    },
    uploadedFileNameTextFormat() {
      if (!this.currentFileUploadName) {
        return '';
      }
      return `${this.currentFileUploadName.substring(
        0,
        5
      )}...${this.currentFileUploadName.substring(
        this.currentFileUploadName.length - 4
      )}`;
    },
  },
  methods: {
    handlePhoneCSVUpload(e) {
      const fileElement = e.target;
      const fileObject = fileElement.files[0];
      this.currentFileUploadName = fileObject.name;
      if (fileObject.size > 1097152) {
        this.$toasted.show('CSV file size is too large.');
        this.currentFileUploadName = '';
        fileElement.value = '';
        return;
      }
      const fileExtenstionSplit = fileObject.name.split('.');
      const fileExtenstion =
        fileExtenstionSplit[fileExtenstionSplit.length - 1];
      if (fileExtenstion !== 'csv') {
        this.$toasted.show('Only CSV files allowed');
        this.currentFileUploadName = '';
        fileElement.value = '';
        return;
      }
      this.uploadPhoneCsv(fileObject);
    },
    uploadPhoneCsv(fileObject) {
      this.isUploadingCSV = true;
      const url = `https://api.foodjaar.com/csv`;
      const uploadCSVFormData = new FormData();
      uploadCSVFormData.append('csv', fileObject);
      axios
        .post(url, uploadCSVFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((response) => {
          this.setPhoneNumbers(response.data.data);
          this.isUploadingCSV = false;
        })
        .catch((error) => {
          Helpers.errorResponse(error, (response) => {
            this.isUploadingCSV = false;
            this.$toasted.show(response);
          });
        });
    },
    setPhoneNumbers(phones) {
      const numbers = [];
      phones.forEach((phone) => {
        for (const key in phone) {
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
      this.defaultCode =
        this.phones[this.phones.length - 1].value.split('-')[1];
      this.phones.push({
        value: '',
        id: Math.random(),
      });
      this.visible =
        this.visible * 5 >= this.phones.length
          ? this.visible
          : this.visible + 1;
    },
    splitAirtime() {
      this.isSplitLoading = true;
      this.splitErrorMessage = '';
      const url = `${process.env.VUE_APP_SENDY_SVC_URL}/sendy/airtime/split`;
      const currencyCode = Helpers.assignCurrencyCode(this.currencyCode);
      axios
        .post(url, { amount: Number(this.amount), currencyCode })
        .then((response) => {
          this.isSplitLoading = false;
          this.splitErrorMessage = '';
          this.splitAirtimeResult = response.data.data;
        })
        .catch((error) => {
          Helpers.errorResponse(error, (response) => {
            this.isSplitLoading = false;
            this.splitErrorMessage = response;
          });
        });
    },
    addGroupContact() {
      if (this.isLoading) return;

      this.isLoading = true;
      const url = `${process.env.VUE_APP_SENDY_SVC_URL}/contacts`;
      this.defaultCode =
        this.phones[this.phones.length - 1].value.split('-')[1];
      const currencyCode = Helpers.assignCurrencyCode(this.defaultCode);
      const airtimeAmount = this.amount;
      const options = this.refinedPhoneNumbers.map(function (element) {
        const newData = {};
        newData.amount = Number(airtimeAmount);
        newData.phone_number = element.split('+')[1];
        newData.currency_code = currencyCode;
        return newData;
      });
      const data = {
        name: this.groupName,
        recipients: options,
        start_date: moment(this.startDate).format('YYYY-MM-DD'),
        end_date: moment(this.endDate).format('YYYY-MM-DD'),
        frequency: this.ticked,
        schedule: this.status,
      };
      axios
        .post(url, data)
        .then((response) => {
          this.isLoading = false;
          const type = '&type=group';
          const page = 1;
          this.$toasted.show(response.data.message);
          this.$store.dispatch('getContacts', { type, page });
          this.$router.push({ name: 'contacts' });
        })
        .catch((error) => {
          Helpers.errorResponse(error, (response) => {
            this.isLoading = false;
            this.$toasted.show(response);
          });
        });
    },
    deleteNumber(index) {
      this.phones.splice(index, 1);
    },
  },
};
</script>

<style lang="scss">
.new-contact {
  max-width: 700px;
  margin: 55px auto;
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

    input[type='file'] {
      display: none;
    }
  }
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

.icon-btn {
  cursor: pointer;
}
</style>
