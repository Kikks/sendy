<template>
  <div class="main">
    <SideNav />

    <div class="content">
      <GreyNavbar title="Profile" />

      <div class="profile">
        <div>
          <label class="profilepic" for="profile-picture">
            <icon v-if="!filePreview && !image" name="camera"></icon>
            <figure v-if="filePreview || image" class="figure">
              <img :src="filePreview || image" />
            </figure>

            <input
              @change="handleFileChange"
              type="file"
              id="profile-picture"
              class="file-input"
              accept="image/*"
            />
          </label>
          <tl-input
            label="First Name"
            placeholder="First Name"
            v-model="first_name"
          />
          <tl-input
            label="Last Name"
            placeholder="Last Name"
            v-model="last_name"
          />
        </div>

        <button
          class="btn"
          :disabled="canSubmit || isLoading"
          @click="updateProfile"
        >
          <icon name="loading" spin size="0.9" v-if="isLoading" class="mr-1" />
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Helpers from '../../utils/Helpers';
import SideNav from '../../components/SideNav.vue';

export default {
  data() {
    return {
      first_name: '',
      last_name: '',
      image: null,
      file: null,
      isLoading: false,
    };
  },
  mounted() {
    this.setDefaultFormValues();
  },
  computed: {
    canSubmit() {
      if (this.first_name.length < 1 || this.last_name.length < 1) {
        return true;
      }
      return false;
    },
    user() {
      return this.$store.getters.getUser;
    },
    filePreview() {
      return this.file ? URL.createObjectURL(this.file) : null;
    },
  },
  methods: {
    setDefaultFormValues() {
      this.first_name = this.user.first_name;
      this.last_name = this.user.last_name;
      this.image = this.user.image || null;
    },
    handleFileChange(event) {
      const files = event.target.files;

      if (files && files[0]) {
        this.file = files[0];
      }
    },
    updateProfile() {
      this.isLoading = true;
      const data = {
        first_name: this.first_name,
        last_name: this.last_name,
        // Uncomment this if we've added file upload
        // image: this.image
      };
      this.$store
        .dispatch('updateUser', { data, type: 'update_info' })
        .then((response) => {
          this.isLoading = false;
          this.$toasted.show(response.data.message);
          this.$router.push({ name: 'home' });
        })
        .catch((error) => {
          Helpers.errorResponse(error, (response) => {
            this.isLoading = false;
            this.$toasted.show(response);
          });
        });
    },
  },
  components: { SideNav },
};
</script>

<style lang="scss" scoped>
.profile {
  margin-top: 55px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 80vh;
  max-width: 700px;
  margin: 55px auto;

  .profilepic {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: #eee;
    margin: 0 auto;
    margin-top: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #aaa;
    cursor: pointer;

    .cameraicon {
      width: 100%;
      height: 40px;
      background-color: transparent;
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

.file-input {
  display: none;
}

.figure {
  height: 100%;
  width: 100%;
  border-radius: 50%;
  overflow: hidden;
  margin: 0;

  & img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
}
</style>
