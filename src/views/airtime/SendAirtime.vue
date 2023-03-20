<template>
  <div class="main">
    <SideNav />

    <div class="content">
      <GreyNavbar title="Send Airtime" />

      <div class="send-airtime">
        <h3>
          <b>Select Category</b>
        </h3>

        <div class="switcher mt-3">
          <div class="switch" :class="tab && 'active'" @click="tab = true">
            New Recipient
          </div>
          <div class="switch" :class="!tab && 'active'" @click="tab = false">
            Saved Recipients
          </div>
        </div>

        <div v-if="tab" class="mt-5">
          <tl-input v-model="name" label="Name" placeholder="Name" />

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

          <div v-if="uploadedCSV" class="row pt-3 align-items-center">
            <div
              v-if="!(visible < 2)"
              class="col"
              @click="visible = visible > 1 ? visible - 1 : visible"
            >
              <center>
                <small class="cursor-pointer">Show Less.</small>
              </center>
            </div>
            <div
              v-if="!(visible * 5 >= phones.length)"
              class="col"
              @click="
                visible = visible * 5 >= phones.length ? visible : visible + 1
              "
            >
              <center>
                <small class="cursor-pointer">Show More.</small>
              </center>
            </div>
          </div>
          <div v-if="uploadedCSV" class="row pt-3 align-items-center">
            <div class="col">
              <center>
                <small
                  >{{
                    slicedPhones.reduce(
                      (acc, element) => acc + element.length,
                      0
                    )
                  }}
                  of {{ phones.length }}</small
                >
              </center>
            </div>
          </div>

          <div class="row pt-3 mb-5 justify-content-end align-items-center">
            <div v-if="phones.length <= 1" class="col-4">
              <a
                target="_blank"
                href="/create-contact-template.csv"
                download
                class="btn small-item link"
                style="padding: 0 1px 0 1px"
              >
                <small>Download CSV format.</small>
              </a>
            </div>

            <div v-if="phones.length <= 1" class="col-4">
              <div
                class="upload-csv-section"
                @click="$refs.CSVFileUpload.click()"
              >
                <span class="small-item">
                  {{
                    uploadedFileNameTextFormat
                      ? uploadedFileNameTextFormat
                      : '+ Upload CSV'
                  }}
                  <icon v-if="isUploadingCSV" name="loading" spin size="0.7" />
                </span>
                <input
                  ref="CSVFileUpload"
                  type="file"
                  accept=".csv"
                  @change="handlePhoneCSVUpload"
                />
              </div>
            </div>

            <div class="col-4">
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

          <div class="row mt-5 justify-content-space-between">
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
        </div>

        <div v-else style="position: relative; z-index: 100">
          <tl-input
            key="searchTerm"
            v-model="searchTerm"
            class="mt-5"
            label="Search Recipient"
            placeholder="Enter Recipient Name"
            icon="magnify"
            type="text"
          />
          <div v-if="shouldShowSearchBox" class="search">
            <div v-on-clickaway="away" class="searchbox">
              <div
                v-if="
                  !isSearchLoading &&
                  !searchErrorMessage &&
                  searchContactResult.length < 1
                "
                class="helpers"
              >
                <span class="">Not found</span>
              </div>

              <div v-if="searchErrorMessage" class="helpers">
                <span class="">{{ searchErrorMessage }}</span>
              </div>

              <div v-if="isSearchLoading" class="helpers">
                <span class="">Searching...</span>
              </div>

              <template v-if="!isSearchLoading">
                <div
                  v-for="contact in searchContactResult"
                  :key="contact.id"
                  class="searchitem"
                  @click="selectContact(contact)"
                >
                  <span>{{ contact.name }}</span>
                  <div class="searchrow">
                    <span>
                      +{{ (contact.recipients || [])[0].phone_number }}

                      <span v-if="(contact.recipients || []).length > 1"
                        >and
                        {{ (contact.recipients || []).length - 1 }} others</span
                      >
                    </span>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <!-- <tl-input
            v-model="amount"
            class="mt-5"
            label="Airtime Amount"
            placeholder="Enter Airtime Amount"
            type="number"
          /> -->

          <span v-if="airtimeMultiples !== false">
            <icon
              v-if="isSplitLoading"
              name="loading"
              spin
              class="mr-1"
              size="0.9"
            />
            <small v-if="splitErrorMessage" :style="{ color: 'red' }">{{
              splitErrorMessage
            }}</small>
            <small
              v-else-if="
                splitAirtimeResult.split && splitAirtimeResult.split.length > 1
              "
            >
              <p>
                Airtime will be sent in multiples of
                <b>{{ splitAirtimeResult.split.join(', ') }}.</b>
              </p>
            </small>
            <small
              v-if="
                splitAirtimeResult.convert &&
                Object.keys(splitAirtimeResult.convert).length !== 0 &&
                !splitErrorMessage
              "
            >
              <p>
                <b>Sendy's Exchange Rate</b>
              </p>
              <p>
                1{{ splitAirtimeResult.convert.sourceCurrency }} =
                {{ splitAirtimeResult.convert.rate
                }}{{ splitAirtimeResult.convert.userCurrency }}
              </p>
              <p>
                {{ amount }}{{ splitAirtimeResult.convert.sourceCurrency }} =
                {{ splitAirtimeResult.convert.conversion
                }}{{ splitAirtimeResult.convert.userCurrency }}
              </p>
            </small>
          </span>
        </div>

        <button
          class="btn mt-5"
          :disabled="canSubmit || isLoading"
          @click="saveContact ? addContact() : transfer()"
        >
          <icon
            v-if="isLoading"
            name="loading"
            spin
            size="0.9"
            class="mr-1"
          />Transfer
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import moment from 'moment';
import { directive as onClickaway } from 'vue-clickaway';
import Papa from 'papaparse';
import Helpers from '../../utils/Helpers.js';
import debounce from '../../utils/Debounce.js';
import countries_code from '../../country_code.json';
import SideNav from '../../components/SideNav.vue';

export default {
  directives: {
    onClickaway,
  },
  components: { SideNav },
  data() {
    return {
      tab: true,
      searchTerm: '',
      name: '',
      ticked: 'daily',
      amount: '',
      start_date: '',
      end_date: '',
      isLoading: false,
      isSplitLoading: false,
      isSearchLoading: false,
      selectedContactId: '',
      showSearch: false,
      visible: 1,
      phones: [{ id: 1, value: '' }],
      status: false,
      saveContact: false,
      status_color_options: {
        checked: '#4CD964',
        unchecked: '#FC001F',
      },
      searchContactResult: [],
      splitAirtimeResult: [],
      searchErrorMessage: '',
      splitErrorMessage: '',
      isUploadingCSV: false,
      uploadedCSV: false,
      defaultCode: 'NG',
      currencyCode: '',
      currentFileUploadName: '',
      countriesCode: countries_code,
    };
  },
  computed: {
    onlyCountryCodes() {
      if (this.phones.length < 2) {
        return this.countriesCode;
      }
      return this.countriesCode.filter((cc) => cc == this.defaultCode);
    },
    slicedPhones() {
      const slicedPhones = [];
      for (let i = 0; i < this.visible; i += 1) {
        slicedPhones.push(this.phones.slice(i * 5, i * 5 + 5));
      }
      if (this.phones.length > 5) this.toggleUploadedCSV(true);
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
    shouldShowSearchBox() {
      if (this.showSearch && this.searchTerm.length > 0) {
        return true;
      }
      return false;
    },
    airtimeMultiples() {
      if (this.amount) {
        if (this.tab && this.phones[this.phones.length - 1].value) {
          this.currencyCode =
            this.phones[this.phones.length - 1].value.split('-')[1];
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
      if (this.amount < 0 || this.splitErrorMessage) {
        return true;
      }
      return false;
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
  watch: {
    searchContactResult(newValue) {
      if (newValue.length < 1) {
        this.selectedContactId = '';
      }
    },
    searchTerm(...args) {
      this.debouncedSearch(...args);
    },
  },
  created() {
    this.debouncedSearch = debounce((newValue) => {
      this.showSearch = true;
      this.search(newValue);
    }, 1000);
  },
  methods: {
    setCurrencyCode(value) {
      this.currencyCode = value;
    },
    toggleUploadedCSV(value) {
      this.uploadedCSV =
        typeof value === 'undefined' ? !this.uploadedCSV : value;
    },
    toggleIsUploadingCSV(value) {
      this.isUploadingCSV =
        typeof value === 'undefined' ? !this.isUploadingCSV : value;
    },
    search(query) {
      this.isSearchLoading = true;
      this.searchErrorMessage = '';
      const url = `${process.env.VUE_APP_SENDY_SVC_URL}/contacts?search=${query}&search_fields=name`;
      axios
        .get(url)
        .then((response) => {
          this.searchContactResult = response.data.data.contacts || [];
          this.isSearchLoading = false;
        })
        .catch((error) => {
          Helpers.errorResponse(error, (response) => {
            this.isSearchLoading = false;
            this.searchErrorMessage = response;
          });
        });
    },
    splitAirtime() {
      this.isSplitLoading = true;
      this.splitErrorMessage = '';
      const url = `${process.env.VUE_APP_SENDY_SVC_URL}/sendy/airtime/split`;
      const data = { amount: Number(this.amount) };
      if (this.tab) {
        const currencyCode = Helpers.assignCurrencyCode(this.currencyCode);
        data.currencyCode = currencyCode;
      } else {
        data.contact = this.selectedContactId;
      }
      axios
        .post(url, data)
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

      const setPhones = (array) => {
        this.phones = array;
      };

      const { toggleIsUploadingCSV } = this;

      Papa.parse(fileObject, {
        header: true,
        complete(results) {
          const { data } = results;
          const phoneNumbers = [];
          for (let i = 0; i < data.length; i += 1) {
            phoneNumbers.push({
              id: i,
              value: data[i]['Phone Number'],
            });
          }
          setPhones(phoneNumbers);
          toggleIsUploadingCSV(false);
        },
        error(error) {
          this.$toasted.show(
            error.message ||
              'We could not parse your CSV file. Try again later.'
          );
          toggleIsUploadingCSV(false);
        },
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
    deleteNumber(index) {
      this.phones.splice(index, 1);
    },
    away() {
      this.searchTerm = '';
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

      this.isLoading = true;
      const url = `${process.env.VUE_APP_SENDY_SVC_URL}/contacts/send-airtime`;

      const countryCodeFromNumber =
        this.phones[this.phones.length - 1].value.split('-')[1] ||
        this.defaultCode;

      this.defaultCode = countryCodeFromNumber;
      const currencyCode = Helpers.assignCurrencyCode(this.defaultCode);
      const airtimeAmount = this.amount;

      const data = {
        category: this.tab ? 'newRecipient' : 'savedRecipient',
      };

      if (this.tab) {
        data.recipients = this.refinedPhoneNumbers.map((number) => ({
          amount: Number(airtimeAmount),
          phone_number: number.split('+')[1]
            ? number.split('+')[1]
            : `234${number.substring(1)}`,
          currency_code: currencyCode,
        }));
      } else {
        data.contact_id = String(this.selectedContactId);
      }

      axios
        .post(url, data)
        .then((response) => {
          this.$toasted.show(response.data.message);
          this.$store.dispatch('getActivities');
          this.$router.push({ name: 'home' });
        })
        .catch((error) => {
          Helpers.errorResponse(error, (response) => {
            this.$toasted.show(response);
          });
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    addContact() {
      if (this.isLoading) return;

      this.isLoading = true;
      const url = `${process.env.VUE_APP_SENDY_SVC_URL}/contacts`;

      const countryCodeFromNumber =
        this.phones[this.phones.length - 1].value.split('-')[1] ||
        this.defaultCode;

      this.defaultCode = countryCodeFromNumber;
      const currencyCode = Helpers.assignCurrencyCode(this.defaultCode);
      const airtimeAmount = this.amount;

      const options = this.refinedPhoneNumbers.map((number) => ({
        amount: Number(airtimeAmount),
        phone_number: number.split('+')[1]
          ? number.split('+')[1]
          : `234${number.substring(1)}`,
        currency_code: currencyCode,
      }));

      const data = {
        name: this.name,
        recipients: options,
        start_date: moment().format('YYYY-MM-DD'),
        end_date: moment().add(1, 'day').format('YYYY-MM-DD'),
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

          if (response.data.data) {
            this.$store.dispatch('getContacts', { type, page });
            setTimeout(this.$toasted.clear(), 10000);
            return this.transfer();
          }
        })
        .catch((error) => {
          this.isLoading = false;
          Helpers.errorResponse(error, (response) => {
            this.$toasted.show(response);
          });
        });
    },
  },
};
</script>

<style lang="scss">
.send-airtime {
  padding: 20px;
  margin: 55px auto;
  max-width: 700px;

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
      padding: 0.5rem 0;
      color: $primary;
      font-size: 16px;
      cursor: pointer;
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
    z-index: 1000;
  }
  .upload-csv-section {
    background: #e6edff;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;
    padding: 0.25rem;

    span {
      font-size: 0.8rem;
      color: $text-color;
    }

    input[type='file'] {
      display: none;
    }
  }
  .searchbox {
    width: 100%;
    height: auto;
    max-height: 250px;
    background: #ffffff;
    box-shadow: 0px 20px 50px #e9edee;
    border-radius: 0px 0px 10px 10px;
    overflow-y: auto;
    z-index: 100;

    .searchitem {
      border-bottom: 1px solid#E6EDFF;
      padding: 0.5rem 1rem;
      cursor: pointer;

      &:hover {
        background-color: #eee;
      }

      &:last-child {
        border-bottom: none;
      }
    }

    .searchrow {
      color: #777;
      font-size: 14px;
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

.cursor-pointer {
  cursor: pointer;
}

.small-item {
  @media (max-width: 600px) {
    font-size: 0.75rem !important;
  }
}

.helpers {
  width: 100%;
  padding: 2rem 1rem;
}
</style>
