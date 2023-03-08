<template>
  <div class="main">
    <SideNav />

    <div class="content">
      <GreyNavbar title="Edit Contact" />

      <div class="edit-contact">
        <div v-if="isFetchingContact" class="text-center">
          <icon name="loading" spin primary />
        </div>
        <div v-if="errorMessage" class="text-center">
          <span>{{ errorMessage }}</span>
        </div>
        <div v-if="!isFetchingContact && !errorMessage && phones.length > 0">
          <p class="text-center">
            Enter contacts's name, phone number and airtime frequency
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
                  @click.native="deleteNumber(index)"
                />
              </div>
              <div :class="phones.length > 1 ? 'col-11' : 'col-12'">
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
              ></date-picker>
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
              ></date-picker>
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
            @click="editContact"
          >
            <icon
              v-if="isLoading"
              name="loading"
              spin
              class="mr-1"
              size="0.9"
            />Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import Helpers from '../../utils/Helpers';
import countries_code from '../../country_code.json';
import SideNav from '../../components/SideNav.vue';

export default {
  components: { SideNav },
  data() {
    return {
      groupName: '',
      ticked: 'daily',
      visible: 1,
      amount: '',
      phones: [],
      startDate: '',
      endDate: '',
      isLoading: false,
      isSplitLoading: false,
      isFetchingContact: false,
      isUploadingCSV: false,
      uploadedCSV: false,
      status: true,
      status_color_options: {
        checked: '#4CD964',
        unchecked: '#FC001F',
      },
      contact: {},
      errorMessage: '',
      countriesCode: countries_code,
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
  mounted() {
    this.getContact();
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
    getContact() {
      this.isFetchingContact = true;
      this.errorMessage = '';
      const contactId = this.$route.params.id;
      const url = `${process.env.VUE_APP_SENDY_SVC_URL}/contacts/${contactId}`;
      axios
        .get(url)
        .then((response) => {
          this.setContact(response.data.data);
        })
        .catch((error) => {
          Helpers.errorResponse(error, (response) => {
            this.errorMessage = response;
            this.$toasted.show(response);
          });
        })
        .finally(() => {
          this.isFetchingContact = false;
        });
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
    setContact(contact) {
      this.groupName = contact.name;
      this.ticked = contact.frequency;
      this.amount = String(contact.recipients[0].amount);
      this.startDate = contact.start_date;
      this.endDate = contact.end_date;
      this.defaultCode = contact.recipients[0].currency_code.substring(
        0,
        contact.recipients[0].currency_code.length - 1
      );
      this.status = !!contact.schedule;
      contact.recipients.forEach((recipient) => {
        this.phones.push({
          id: Math.random(),
          value: recipient.phone_number.substring(3),
        });
      });
      this.contact = contact;
    },
    editContact() {
      if (this.isLoading) return;
      this.isLoading = true;
      const url = `${process.env.VUE_APP_SENDY_SVC_URL}/contacts/${this.contact.id}`;
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
        .patch(url, data)
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
    changeIcon(data) {
      this.ticked = data;
    },
    deleteNumber(index) {
      this.phones.splice(index, 1);
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
  },
};
</script>

<style lang="scss">
.edit-contact {
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

  .success-state .field.vue-input-ui .lm-text-danger {
    color: green !important;
  }

  .error-state .field.vue-input-ui .lm-text-danger {
    color: red !important;
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
</style>
