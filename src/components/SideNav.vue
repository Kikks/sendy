<template>
  <div class="sidenav">
    <div class="logo-container">
      <figure class="logo">
        <img src="../assets/logo.svg" />
      </figure>
    </div>

    <div class="links">
      <router-link
        :to="{ name: 'home' }"
        tag="div"
        class="link"
        exact-active-class="active"
      >
        <icon name="home" />
        <div class="text">Home</div>
      </router-link>
      <router-link
        :to="{ name: 'topup' }"
        tag="div"
        class="link"
        active-class="active"
      >
        <icon name="trending-up" />
        <div class="text">Top up</div>
      </router-link>
      <router-link
        :to="{ name: 'contacts' }"
        tag="div"
        class="link"
        active-class="active"
      >
        <icon name="account-circle-outline" />
        <div class="text">Contacts</div>
      </router-link>
    </div>

    <hr />

    <div class="links">
      <router-link
        :to="{ name: 'profile' }"
        tag="div"
        class="link"
        active-class="active"
      >
        <icon name="account" />
        <span class="text">Profile</span>
      </router-link>
      <router-link
        :to="{ name: 'cards' }"
        tag="div"
        class="link"
        active-class="active"
      >
        <icon name="credit-card-outline" />
        <span class="text">Cards</span>
      </router-link>
      <router-link
        :to="{ name: 'security' }"
        tag="div"
        class="link"
        active-class="active"
      >
        <icon name="shield-lock-outline" />
        <span class="text">Security</span>
      </router-link>
      <!-- <router-link
        :to="{ name: 'alert' }"
        tag="div"
        class="link"
        active-class="active"
      >
        <icon name="bell-outline" />
        <span class="text">Alert</span>
      </router-link> -->
      <router-link
        :to="{ name: 'settings.help' }"
        tag="div"
        class="link"
        active-class="active"
      >
        <icon name="help-circle-outline" />
        <span class="text">Help</span>
      </router-link>
    </div>

    <hr />

    <div class="link logout" @click="logout">
      <icon name="logout-variant" />
      <span class="text">Logout</span>
    </div>

    <hr />

    <div class="bottom">
      <div class="socials">
        <a :href="`mailto:hello@tinylabs.app`" target="_blank">
          <span class="social-icon">
            <icon name="email" />
          </span>
        </a>
        <a :href="`https://instagram.com/tinylabsapp`" target="_blank">
          <span class="social-icon">
            <icon name="instagram" />
          </span>
        </a>
        <a :href="`https://twitter.com/tinylabsapp`" target="_blank">
          <span class="social-icon">
            <icon name="twitter" />
          </span>
        </a>
      </div>
      <div class="footer">&copy; 2020 Tinylabs | All rights reserved.</div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$store.dispatch('logout').then(() => {
        this.$router.push({ name: 'onboard' });
        this.$toasted.show('Logout successful');
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.sidenav {
  display: none;
  background-color: rgba($color: #006fff, $alpha: 0.05);
  width: 300px;
  padding: 1.5rem;

  @media (min-width: 1024px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .logo {
    height: 2.5rem;
    aspect-ratio: 3/1;
    margin-bottom: 2rem;

    & img {
      height: 100%;
      width: 100%;
      object-fit: contain;
    }
  }

  .links {
    width: 100%;
  }

  .link {
    width: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
    font-weight: 700;
    transition: all 0.2s;
    padding: 0.4rem 1rem;
    border-radius: 2rem;
    font-size: 0.9rem;
    background-color: transparent;

    & .mdi {
      margin-right: 1rem;

      &::before {
        font-size: 1.2rem;
      }
    }

    &:hover {
      color: rgba($color: #006fff, $alpha: 0.7);
    }

    &.active {
      color: $primary;
      background-color: rgba($color: #006fff, $alpha: 0.2);

      .mdi {
        color: $primary;
      }
    }
  }

  .logout {
    color: red;
  }

  hr {
    width: 100%;
    margin: 1rem 0;
  }

  .bottom {
    margin-top: auto;
    width: 100%;
    display: grid;
    justify-items: center;

    .socials {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      justify-items: center;
      gap: 1rem;
    }

    .social-icon {
      width: 30px;
      height: 30px;
      color: white;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      background-color: $primary;
      border-radius: 50%;
      .mdi {
        font-size: 0.75rem !important;
      }
    }
    .footer {
      margin-top: 15px;
      color: $text-color;
      opacity: 0.4;
      font-size: 14px;
    }
  }
}
</style>
