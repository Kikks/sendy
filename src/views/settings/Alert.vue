<template>
  <div class="main">
    <SideNav />

    <div class="content">
      <GreyNavbar title="Alert" />

      <div class="alert">
        <div v-if="isFetchingAlertInfo" class="text-center">
          <icon name="loading" spin primary />
        </div>
        <div v-if="errorMessage" class="text-center">
          <span>{{ errorMessage }}</span>
        </div>
        <div v-if="!isFetchingAlertInfo">
          <div>
            <p class="text-center mt-1 mb-5">
              An email would be sent to you weekly whenever your sendy balance
              goes below the specified threshold.
            </p>
            <div class="row justify-content-space-between">
              <div class="col">
                {{ notification ? 'Disable' : 'Enable' }} Notification
              </div>
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
            <tl-input
              v-model="threshold"
              class="mb-5"
              placeholder="Threshold (in NGN)"
            />

            <p class="text-center mt-1 mb-5">
              A report would also be sent to your email inbox whenever airtime
              is sent.
            </p>

            <div class="row justify-content-space-between">
              <div class="col">{{ report ? 'Disable' : 'Enable' }} Report</div>
              <div class="col-6 text-right">
                <toggle-button
                  v-model="report"
                  :height="30"
                  :width="60"
                  class="ml-2"
                  :color="status_color_options"
                />
              </div>
            </div>
          </div>

          <button
            class="btn mt-5"
            :disabled="canSubmit || isLoading"
            @click="updateAlert"
          >
            <icon
              v-if="isLoading"
              name="loading"
              spin
              size="0.9"
              class="mr-1"
            />Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import SideNav from '../../components/SideNav.vue';
import Helpers from '../../utils/Helpers';

export default {
  components: { SideNav },
  data() {
    return {
      notification: false,
      report: false,
      threshold: '0',
      isFetchingAlertInfo: false,
      status_color_options: {
        checked: '#4CD964',
        unchecked: '#FC001F',
      },
      isLoading: false,
      errorMessage: '',
    };
  },
  computed: {
    canSubmit() {
      if (
        typeof this.notification === 'boolean' &&
        this.threshold >= 0 &&
        this.threshold
      ) {
        return false;
      }
      return true;
    },
    user() {
      return this.$store.getters.getUser;
    },
  },
  mounted() {
    this.getAlertInfo();
  },
  methods: {
    updateAlert() {
      this.isLoading = true;
      const url = `${process.env.VUE_APP_SENDY_SVC_URL}/sendy/user`;
      const data = {
        notification: this.notification,
        report: this.report,
        threshold: Number(this.threshold),
      };
      axios
        .patch(url, data)
        .then(() => {
          this.isLoading = false;
          this.$toasted.show('Alert Updated Successfully');
          // this.$router.push({ name: "alert" });
        })
        .catch((error) => {
          Helpers.errorResponse(error, (response) => {
            this.isLoading = false;
            this.$toasted.show(response);
          });
        });
    },
    getAlertInfo() {
      if (this.isFetchingAlertInfo) return;
      this.isFetchingAlertInfo = true;
      this.error = '';
      const url = `${process.env.VUE_APP_SENDY_SVC_URL}/user`;
      axios
        .get(url)
        .then((response) => {
          this.isFetchingAlertInfo = false;
          this.setDefaultFormValues(response.data.data);
        })
        .catch((error) => {
          Helpers.errorResponse(error, (response) => {
            this.isFetchingAlertInfo = false;
            this.errorMessage = response;
            this.$toasted.show(response);
          });
        });
    },
    setDefaultFormValues(user) {
      this.threshold = user.threshold ? user.threshold.toString() : '0';
      this.notification = user.notification ? user.notification : false;
    },
  },
};
</script>
<style lang="scss" scoped>
.alert {
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 80vh;
  margin: 55px auto;
  max-width: 700px;
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
