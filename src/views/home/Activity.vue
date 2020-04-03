<template>
  <div class="activity">
    <div class="header">
      <h3 class="mb-3">Wallet Balance</h3>
      <h1
        class="mb-4"
      >{{ userInfo.defaultCurrency }} {{ userInfo.wallet ? Number.parseFloat(userInfo.wallet).toFixed(2) : '0.00' }}</h1>
      <div class="px-5">
        <button class="btn outline" @click="gotoAirtime()">Send Airtime</button>
      </div>
    </div>
    <div class="recent-activity">
      <div class="d-flex flex-row mb-4 justify-content-between align-items-center">
        <div>
          <h2 class>Recent Actions</h2>
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
      <div
        class="d-flex justify-content-center align-items-center"
        style="height: 50vh"
        v-if="isLoading"
      >
        <icon name="loading" spin primary />
      </div>
      <div
        class="d-flex justify-content-center align-items-center"
        style="height: 50vh"
        v-if="errorMessage"
      >{{errorMessage}}</div>
      <div
        class="d-flex justify-content-center align-items-center"
        style="height: 50vh"
        v-if="!isLoading && !errorMessage && refinedActivities.length < 1"
      >You don't have any recent actions</div>

      <div v-for="(activity, i) in refinedActivities" :key="i" class="activityRow">
        <div class="row firstRow">
          <div class="col-5 blue">{{activity.description}}</div>
          <div
            class="col-5 text-right"
            :class="activity.type  === 'credit' ? 'green' : 'red'"
          >{{ activity.currency }}{{ activity.amount }}</div>
          <div class="col-2 ss">
            <div class="dropdown" @click="show(activity)">
              <div>
                <icon name="dots-vertical" />
              </div>
              <div class="dropdown-menu" :ref="`dropdown-menu-${activity.id}`">
                <div class="dropdown-item" @click="showResendAirtimeModal(activity)">
                  <span>Resend</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row secondRow">
          <div class="col-5 blue">{{activity.date}}</div>
          <div class="col-5 text-right">{{ activity.title ? activity.title : '----' }}</div>
        </div>
      </div>
    </div>
    <tl-modal :name="resendAirtimeModal">
      <div class="row justify-content-center">
        <div class="col-11">
          <h2>Resend Airtime</h2>
          <span>
            Are you sure you want to resend airtime
            <!-- <b>{{activity.name}}</b> -->
          </span>
          <div class="row my-2">
            <div class="col">
              <button class="btn small accent" @click="hideResendAirtimeModal">No</button>
            </div>
            <div class="col">
              <button class="btn small block" @click="resendAirtime" :disabled="isLoading">
                <icon name="loading" spin size="0.7" v-if="isLoading" />Yes, delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </tl-modal>
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";
import dropdown from "vue-dropdowns";
import Helpers from "../../utils/Helpers";

export default {
  data() {
    return {
      activities: [],
      isLoading: false,
      resendAirtimeModal: "resend-airtime-modal",
      errorMessage: ""
    };
  },
  computed: {
    refinedActivities() {
      let refinedArray = [];
      this.$store.getters.getActivities.forEach(activity => {
        refinedArray.push({
          ...activity,
          amount: Number.parseFloat(activity.amount).toFixed(2),
          date: moment(activity.createdAt).format("MMM Do YY")
        });
      });
      return refinedArray;
    },
    userInfo() {
      return this.$store.getters.getUserInfo;
    },
    paginationMetaData() {
      return this.$store.getters.getPaginationMetaData;
    }
  },
  methods: {
    show(activity) {
      const elem = this.$refs[`dropdown-menu-${activity.id}`];
      if (elem[0]) {
        elem[0].classList.toggle("show");
      }
    },
    showResendAirtimeModal(contact) {
      this.$modal.show(this.resendAirtimeModal);
      this.contact = contact;
    },
    hideResendAirtimeModal() {
      this.$modal.hide(this.resendAirtimeModal);
    },
    nextData() {
      if (this.paginationMetaData.nextPage) {
        this.$store.commit("setActivities", []);
        this.getActivities(this.paginationMetaData.nextPage);
      }
    },
    prevData() {
      if (this.paginationMetaData.previousPage) {
        this.$store.commit("setActivities", []);
        this.getActivities(this.paginationMetaData.previousPage);
      }
    },
    getUserInfo() {},
    getActivities(page = 1) {
      this.isLoading = true;
      this.$store
        .dispatch("getActivities", page)
        .then(response => {
          this.isLoading = false;
          this.$store.commit("setPaginationMetaData", response.data.meta);
        })
        .catch(error => {
          Helpers.errorResponse(error, response => {
            this.isLoading = false;
            this.errorMessage = response;
          });
        });
    },
    gotoAirtime() {
      this.$router.push({ name: "send-airtime" });
    }
  },
  mounted() {
    this.$store.dispatch("getUserInfo");
    if (this.$store.getters.getActivities.length < 1) {
      this.getActivities();
    }
  }
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
}
.recent-activity {
  padding: 20px;
  background-color: white;
  min-height: 80vh;
  border-radius: 20px 20px 0px 0px;
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
</style>