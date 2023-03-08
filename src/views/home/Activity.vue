<template>
  <div class="activity">
    <div class="header">
      <div class="balance-container">
        <h3 class="mb-3 balance-title">Wallet Balance</h3>

        <icon
          v-if="userInfoIsLoading"
          name="loading"
          spin
          color="white"
          size="3rem"
        />

        <h1 v-else class="mb-4 balance">
          {{ userInfo.defaultCurrency || 'NGN' }}
          {{
            userInfo.balance
              ? Number(Number(userInfo.balance).toFixed(2)).toLocaleString()
              : '0.00'
          }}
        </h1>
      </div>
      <div class="px-5 btn-container">
        <button class="btn outline" @click="gotoAirtime()">Send Airtime</button>
      </div>
    </div>
    <div class="recent-activity">
      <div
        class="d-flex flex-row mb-4 justify-content-between align-items-center"
      >
        <div>
          <h2 class>Recent Transactions</h2>
        </div>
        <div>
          <pagination
            :page="paginationMetaData.page || 0"
            :page-count="paginationMetaData.total_pages || 0"
            @nextData="nextData"
            @prevData="prevData"
          />
        </div>
      </div>

      <div
        v-if="isLoading"
        class="d-flex justify-content-center align-items-center"
        style="height: 50vh"
      >
        <icon name="loading" spin primary />
      </div>

      <div
        v-if="errorMessage"
        class="d-flex justify-content-center align-items-center"
        style="height: 50vh"
      >
        {{ errorMessage }}
      </div>

      <div
        v-if="!isLoading && !errorMessage && refinedActivities.length < 1"
        class="d-flex justify-content-center align-items-center"
        style="height: 50vh"
      >
        You don't have any recent actions
      </div>

      <template v-if="!isLoading">
        <div
          v-for="(activity, i) in refinedActivities"
          :key="i"
          class="activityRow"
        >
          <div
            v-if="
              false
              // activity.failedPhoneNumber &&
              // activity.failedPhoneNumber.length > 0 &&
              // !activity.resendFailedAirtime
            "
            class="row firstRow"
          >
            <div class="col-5 blue">{{ activity.description }}</div>
            <div
              class="col-5 text-right bold"
              :class="activity.entry_type === 'credit' ? 'green' : 'red'"
            >
              NGN
              {{
                ((activity.amount - activity.calc_fees) / 100).toLocaleString()
              }}
            </div>
            <div
              v-if="
                false
                // activity.failedPhoneNumber &&
                // activity.failedPhoneNumber.length > 0 &&
                // !activity.resendFailedAirtime &&
                // activity.entry_type === 'credit'
              "
              class="col-2 ss"
            >
              <div class="dropdown" @click="show(activity)">
                <div>
                  <icon name="dots-vertical" />
                </div>
                <div
                  :ref="`dropdown-menu-${activity.id}`"
                  class="dropdown-menu"
                >
                  <div
                    class="dropdown-item"
                    @click="showResendAirtimeModal(activity)"
                  >
                    <span>Resend</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="row firstRow">
            <div class="col-5 blue">{{ activity.description }}</div>
            <div
              class="col-5 text-right bold"
              :class="activity.entry_type === 'credit' ? 'green' : 'red'"
            >
              NGN
              {{
                ((activity.amount - activity.calc_fees) / 100).toLocaleString()
              }}
            </div>
            <div
              v-if="activity.airtime > 0 && activity.entry_type === 'debit'"
              class="col-2 ss"
            >
              <div class="dropdown" @click="show(activity)">
                <div>
                  <icon name="dots-vertical" />
                </div>
                <div
                  :ref="`dropdown-menu-${activity.id}`"
                  class="dropdown-menu"
                >
                  <div class="dropdown-item">
                    <span @click="log(activity)">Log</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="row secondRow">
            <div class="col-5 blue">{{ activity.date }}</div>
            <div class="col-5 text-right">
              {{ activity.title ? activity.title : '----' }}
            </div>
          </div>
        </div>
      </template>
    </div>

    <tl-modal :name="resendAirtimeModal">
      <div class="row justify-content-center">
        <div class="col-11">
          <h2>Resend Airtime</h2>
          <span>
            Do you want to edit the phone number(s) before resending?
            <!-- <b>{{activity.name}}</b> -->
          </span>
          <div class="row my-2">
            <div class="col">
              <button
                class="btn small block"
                :disabled="isLoading"
                @click="resendAirtime"
              >
                <icon v-if="isLoading" name="loading" spin size="0.7" />No,
                resend
              </button>
            </div>
            <div class="col">
              <button class="btn small block" @click="editPhoneNumber">
                Yes, Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </tl-modal>
  </div>
</template>
<script>
import axios from 'axios';
import moment from 'moment';
import Helpers from '../../utils/Helpers';

export default {
  data() {
    return {
      activities: [],
      isLoading: false,
      userInfoIsLoading: false,
      selectedTransactionId: '',
      resendAirtimeModal: 'resend-airtime-modal',
      errorMessage: '',
    };
  },
  computed: {
    refinedActivities() {
      const refinedArray = [];
      this.$store.getters.getActivities.forEach((activity) => {
        refinedArray.push({
          ...activity,
          amount: Number.parseFloat(activity.amount).toFixed(2),
          date: moment(activity.created_on).format('MMM Do YYYY HH:mm A z'),
        });
      });
      return refinedArray;
    },
    userInfo() {
      return this.$store.getters.getUserInfo;
    },
    paginationMetaData() {
      return this.$store.getters.getPaginationMetaData;
    },
  },
  mounted() {
    this.getUserInfo();
    this.getActivities();
  },
  methods: {
    show(activity) {
      const elem = this.$refs[`dropdown-menu-${activity.id}`];
      if (elem[0]) {
        elem[0].classList.toggle('show');
      }
    },
    showResendAirtimeModal(activity) {
      this.$modal.show(this.resendAirtimeModal);
      this.activity = activity;
    },
    hideResendAirtimeModal() {
      this.$modal.hide(this.resendAirtimeModal);
    },
    editPhoneNumber() {
      this.$router.push({
        name: 'edit.resend-airtime',
        params: { id: this.activity.id },
      });
    },
    log(activity) {
      this.$router.push({
        name: 'activity-log',
        params: { id: activity.id },
      });
    },
    nextData() {
      if (this.paginationMetaData.page < this.paginationMetaData.total_pages) {
        this.$store.commit('setActivities', []);
        this.getActivities(this.paginationMetaData.page + 1);
      }
    },
    prevData() {
      if (this.paginationMetaData.page > 1) {
        this.$store.commit('setActivities', []);
        this.getActivities(this.paginationMetaData.page - 1);
      }
    },
    getUserInfo() {
      this.userInfoIsLoading = true;
      this.$store
        .dispatch('getUserInfo')
        .then(() => {
          this.userInfoIsLoading = false;
        })
        .catch((error) => {
          Helpers.errorResponse(error, (response) => {
            this.isLoading = false;
            this.errorMessage = response;
          });
        });
    },
    getActivities(page = 1) {
      this.isLoading = true;
      this.$store
        .dispatch('getActivities', page)
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
    resendAirtime() {
      if (this.isLoading) return;

      const url = `${process.env.VUE_APP_SENDY_SVC_URL}/sendy/airtime`;

      this.isLoading = true;

      const data = {
        transaction: this.activity.id,
        category: 'resendFailedAirtime',
      };
      axios
        .post(url, data)
        .then((response) => {
          this.isLoading = false;
          this.$toasted.show(response.data.message);
          this.hideResendAirtimeModal();
          this.$store.dispatch('getActivities');
        })
        .catch((error) => {
          Helpers.errorResponse(error, (response) => {
            this.isLoading = false;
            this.$toasted.show(response);
          });
        });
    },
    gotoAirtime() {
      this.$router.push({ name: 'send-airtime' });
    },
  },
};
</script>
<style lang="scss" scoped>
// hr{
//     margin-top: 50px;
// }
.activity {
  background-color: $primary;
  min-height: 100vh;
}
.header {
  background-color: $primary;
  color: white;
  text-align: center;
  padding-top: 30px;
  padding-bottom: 40px;
  h3 {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.7);
  }

  h1 {
    color: white;
    font-weight: bold;
  }

  .btn {
    max-width: 300px;
  }

  @media (min-width: 1024px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 3rem;

    .balance-container {
      display: grid;
      justify-items: start;
      gap: 0.5rem;
    }

    .balance,
    .balance-title {
      margin-bottom: 0 !important;
    }

    .btn-container {
      padding: 0 !important;
    }
  }
}
.recent-activity {
  padding: 20px;
  background-color: white;
  min-height: 80vh;
  border-radius: 20px 20px 0px 0px;

  @media (min-width: 1024px) {
    border-radius: 0;
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
    .bold {
      font-weight: 700;
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
</style>
