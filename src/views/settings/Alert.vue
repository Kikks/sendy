<template>
  <div>
    <GreyNavbar title="Alert" />

    <div class="alert">
      <div class="text-center" v-if="isFetchingAlertInfo">
        <icon name="loading" spin primary />
      </div>
      <div class="text-center" v-if="errorMessage">
        <span>{{errorMessage}}</span>
      </div>
      <div v-if="!isFetchingAlertInfo">
        <div>
          <p
            class="text-center mt-1 mb-5"
          >An email would be sent to you weekly whenever your sendy balance goes below the specified threshold.</p>
          <div class="row justify-content-space-between">
            <div class="col">{{ notification ? 'Disable' : 'Enable' }} Notification</div>
            <div class="col-6 text-right">
              <toggle-button
                v-model="notification"
                :height="30"
                :width="60"
                class="ml-2"
                :color="status_color_options"
              />
            </div>
          </div>
          <tl-input class="mb-5" placeholder="Threshold (in NGN)" v-model="threshold" />
        </div>

        <button class="btn mt-5" :disabled="canSubmit || isLoading" @click="updateAlert">
          <icon name="loading" spin size="0.9" v-if="isLoading" class="mr-1" />Save Changes
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Helpers from "../../utils/Helpers";

export default {
  data() {
    return {
      notification: false,
      threshold: "0",
      isFetchingAlertInfo: false,
      status_color_options: {
        checked: "#4CD964",
        unchecked: "#FC001F"
      },
      isLoading: false,
      errorMessage: ""
    };
  },
  computed: {
    canSubmit() {
      if (
        typeof this.notification === "boolean" &&
        this.threshold >= 0 &&
        this.threshold
      ) {
        return false;
      }
      return true;
    },
    user() {
      return this.$store.getters.getUser;
    }
  },
  methods: {
    updateAlert() {
      this.isLoading = true;
      const url = `${process.env.VUE_APP_SENDY_SVC_URL}/sendy/user`;
      const data = {
        notification: this.notification,
        threshold: Number(this.threshold)
      };
      axios
        .patch(url, data)
        .then(response => {
          this.isLoading = false;
          this.$toasted.show("Alert Updated Successfully");
          // this.$router.push({ name: "alert" });
        })
        .catch(error => {
          Helpers.errorResponse(error, response => {
            this.isLoading = false;
            this.$toasted.show(response);
          });
        });
    },
    getAlertInfo() {
      if (this.isFetchingAlertInfo) return;
      this.isFetchingAlertInfo = true;
      this.error = "";
      const url = `${process.env.VUE_APP_SENDY_SVC_URL}/sendy/user`;

      axios
        .get(url)
        .then(response => {
          this.isFetchingAlertInfo = false;
          this.setDefaultFormValues(response.data.data);
        })
        .catch(error => {
          Helpers.errorResponse(error, response => {
            this.isFetchingAlertInfo = false;
            this.errorMessage = response;
            this.$toasted.show(response);
          });
        });
    },
    setDefaultFormValues(user) {
      this.threshold = user.threshold.toString() || "0";
      this.notification = user.notification || false;
    }
  },
  mounted() {
    this.getAlertInfo();
  }
};
</script>
<style lang="scss" scoped>
.alert {
  margin-top: 55px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 80vh;
}
</style>