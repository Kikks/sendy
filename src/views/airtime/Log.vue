<template>
  <div class="main">
    <SideNav />

    <div class="content">
      <GreyNavbar title="Activity Log"></GreyNavbar>
      <div class="airtime-log">
        <div
          class="d-flex flex-row mb-4 justify-content-between align-items-center"
        >
          <div>
            <download-csv
              :disabled="
                filteredAllTransactions.length < 1 || isFetchingAllTransaction
              "
              class="btn small"
              :data="allLogs"
              name="export.csv"
            >
              <icon
                name="loading"
                spin
                class="mr-1"
                size="0.9"
                v-if="isLoading"
              />
              Export CSV
            </download-csv>
            <!-- <button class="btn small"  @click="``">
            <icon name="loading" spin class="mr-1" size="0.9" v-if="isLoading" />Export CSV
          </button> -->
          </div>
          <div>
            <pagination
              :page="paginationMetaData.page || 0"
              :pageCount="paginationMetaData.pageCount || 0"
              @nextData="nextData"
              @prevData="prevData"
            />
          </div>
        </div>
        <div class="text-center" v-if="isFetchingTransaction">
          <icon name="loading" spin primary />
        </div>
        <div class="text-center" v-if="errorMessage">
          <span>{{ errorMessage }}</span>
        </div>
        <div
          v-if="
            !isFetchingTransaction &&
            !errorMessage &&
            filteredTransactions &&
            filteredTransactions.length < 1
          "
        >
          <span>You currently have no logs</span>
        </div>
        <div v-if="!isFetchingTransaction && !errorMessage">
          <tl-input
            class="mt-5"
            v-model="searchTerm"
            placeholder="Search"
            icon="magnify"
            type="text"
            key="searchTerm"
          />
          <div class="search" v-if="shouldShowSearchBox">
            <div class="searchbox px-3 pb-3" v-on-clickaway="away">
              <div
                class="row pt-3"
                v-if="
                  !isSearchLoading &&
                  !searchErrorMessage &&
                  searchTransactionResult.length < 1
                "
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
                v-for="transaction in searchTransactionResult"
                :key="transaction.id"
              >
                <div class="row">
                  <div class="col-6">{{ transaction.phoneNumber }}</div>
                  <div
                    class="col-6 text-right"
                    :class="
                      !transaction.status || transaction.status === 'Failed'
                        ? 'red'
                        : 'green'
                    "
                  >
                    {{ transaction.status ? transaction.status : 'N/A' }}
                  </div>
                </div>
                <div class="row searchrow">
                  <div class="col-6">
                    {{ transaction.currencyCode }}{{ transaction.amount }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-for="airtime in filteredTransactions"
          :key="airtime.id"
          class="activityRow"
        >
          <div class="row">
            <div class="col">
              <div class="row firstRow">
                <div class="col-6 blue">{{ airtime.phoneNumber }}</div>
                <!-- <div class="col-6 text-right" :class="{red: !activity.add, green: activity.add}"> -->
                <div
                  class="col-6 text-right"
                  :class="
                    !airtime.status || airtime.status === 'Failed'
                      ? 'red'
                      : 'green'
                  "
                >
                  {{ airtime.status ? airtime.status : 'N/A' }}
                </div>
              </div>
              <div class="row secondRow">
                <div class="col-6 blue">
                  <span>{{ airtime.currencyCode }}{{ airtime.amount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import moment from 'moment';
import { directive as onClickaway } from 'vue-clickaway';
import SideNav from '../../components/SideNav.vue';
import Helpers from '../../utils/Helpers';

export default {
  directives: {
    onClickaway: onClickaway,
  },
  data() {
    return {
      isLoading: false,
      searchTerm: '',
      log: [],
      allLogs: [],
      showSearch: false,
      isSearchLoading: false,
      searchTransactionResult: [],
      searchErrorMessage: '',
      isFetchingTransaction: false,
      isFetchingAllTransaction: false,
      errorMessage: '',
    };
  },
  computed: {
    filteredTransactions() {
      let refinedArray = [];
      this.$store.getters.getTransactions.forEach((data) => {
        refinedArray.push({
          phoneNumber: data.phoneNumber,
          currencyCode: data.currencyCode,
          amount: data.amount,
          status: data.status,
        });
      });
      this.log = refinedArray;
      return refinedArray;
    },
    filteredAllTransactions() {
      let refinedArray = [];
      this.allLogs.forEach((data) => {
        refinedArray.push({
          phoneNumber: data.phoneNumber,
          currencyCode: data.currencyCode,
          amount: data.amount,
          status: data.status,
        });
      });
      this.allLogs = refinedArray;
      return refinedArray;
    },
    shouldShowSearchBox() {
      if (this.showSearch && this.searchTerm.length > 0) {
        return true;
      }
      return false;
    },
    paginationMetaData() {
      return this.$store.getters.getPaginationMetaData;
    },
  },
  watch: {
    searchTerm(v) {
      if (v.length > 0) {
        this.search(v);
        this.showSearch = true;
      }
    },
  },
  methods: {
    nextData() {
      if (this.paginationMetaData.nextPage) {
        this.$store.commit('setTransactions', []);
        this.getTransactions(this.paginationMetaData.nextPage);
      }
    },
    prevData() {
      if (this.paginationMetaData.previousPage) {
        this.$store.commit('setTransactions', []);
        this.getTransactions(this.paginationMetaData.previousPage);
      }
    },
    getTransactions(page = 1) {
      this.isFetchingTransaction = true;
      const transactionId = this.$route.params.id;
      this.$store
        .dispatch('getTransactions', { transactionId, page })
        .then((response) => {
          this.isFetchingTransaction = false;
          this.$store.commit('setPaginationMetaData', response.data.meta);
        })
        .catch((error) => {
          Helpers.errorResponse(error, (response) => {
            this.isFetchingTransaction = false;
            this.errorMessage = response;
          });
        });
    },
    search(query) {
      this.isSearchLoading = true;
      this.searchErrorMessage = '';
      const transactionId = this.$route.params.id;
      const url = `${process.env.VUE_APP_SENDY_SVC_URL}/sendy/transaction/airtime/search/${transactionId}`;
      axios
        .post(url, { query })
        .then((response) => {
          this.searchTransactionResult = response.data.data;
          this.isSearchLoading = false;
        })
        .catch((error) => {
          Helpers.errorResponse(error, (response) => {
            this.isSearchLoading = false;
            this.searchErrorMessage = response;
          });
        });
    },
    getAllTransaction() {
      this.isFetchingAllTransaction = true;
      const transactionId = this.$route.params.id;
      const url = `${process.env.VUE_APP_SENDY_SVC_URL}/sendy/transaction/airtime/${transactionId}?per_page=-1`;
      axios
        .get(url)
        .then((response) => {
          this.allLogs = response.data.data;
          this.isFetchingAllTransaction = false;
        })
        .catch((error) => {
          Helpers.errorResponse(error, (response) => {
            this.isFetchingAllTransaction = false;
          });
        });
    },
    away() {
      this.searchTerm = '';
      this.showSearch = false;
    },
    // selectTransaction(transaction) {
    //   this.searchTerm = transaction.name;
    //   setTimeout(() => {
    //     this.showSearch = false;
    //   }, 0);
    // },
  },
  mounted() {
    //if (this.$store.getters.getTransactions.length < 1) {
    this.getTransactions();
    this.getAllTransaction();
    // }
  },
  components: { SideNav },
};
</script>
<style lang="scss">
.resend-airtime {
  padding: 20px;
  margin: 55px auto;
  max-width: 700px;
}
.airtime-log {
  padding: 20px;
  margin-top: 55px;
  background-color: white;
  min-height: 80vh;
  border-radius: 20px 20px 0px 0px;
  .search {
    position: absolute;
    width: 100%;
    // max-width: calc($full-width - 10px);
    max-width: $full-width;
    z-index: 1;
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
  .activityRow {
    padding: 20px 0;
    border-bottom: 0.5px solid #e6edff;
    .red {
      color: #f43939;
    }
    .green {
      color: #54c100;
    }
    .blue {
      color: #030039;
    }

    .secondRow {
      font-size: 14px;
      opacity: 0.5;
    }

    &:last-child {
      margin-bottom: 72px;
    }
    .dropdown {
      .show {
        display: block;
      }
    }
    .dropdown-menu {
      right: -6px;
      left: initial;
      top: initial;
      float: initial;
      min-width: 120px;
      z-index: 7;
    }
  }

  h2 {
    font-size: 17px;
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
