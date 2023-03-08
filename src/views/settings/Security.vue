<template>
  <div class="main">
    <SideNav />

    <div class="content">
      <GreyNavbar title="Security" />

      <div class="security">
        <div>
          <tl-input
            v-model="oldPassword"
            label="Old Password"
            type="password"
            placeholder="Enter Old Password"
          />
          <tl-input
            v-model="newPassword"
            label="New Password"
            type="password"
            placeholder="Enter New Password"
          />
          <tl-input
            v-model="confirmNewPassword"
            label="Confirm New Password"
            type="password"
            placeholder="Confirm New Password"
          />
        </div>

        <button
          class="btn mt-5"
          :disabled="canSubmit || isLoading"
          @click="updatePassword"
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
</template>
<script>
import SideNav from '../../components/SideNav.vue';
import Helpers from '../../utils/Helpers.js';

export default {
  components: { SideNav },
  data() {
    return {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      isLoading: false,
    };
  },
  computed: {
    canSubmit() {
      if (
        this.oldPassword.length < 1 ||
        this.newPassword.length < 1 ||
        this.confirmNewPassword.length < 1
      ) {
        return true;
      }
      return false;
    },
  },
  methods: {
    updatePassword() {
      if (this.newPassword !== this.confirmNewPassword) {
        this.$toasted.show('Password must match');
        return;
      }
      this.isLoading = true;
      const data = {
        old_password: this.oldPassword,
        new_password: this.newPassword,
      };
      this.$store
        .dispatch('updateUserPassword', { data })
        .then((response) => {
          this.isLoading = false;
          this.$toasted.show(response.data.message);
          this.$store.dispatch('logout').then(() => {
            this.$router.push({ name: 'onboard' });
            this.$toasted.show('You have to login with your new password.');
          });
        })
        .catch((error) => {
          Helpers.errorResponse(error, (response) => {
            this.isLoading = false;
            this.$toasted.show(response);
          });
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.security {
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
