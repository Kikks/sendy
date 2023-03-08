<template>
  <div class="main">
    <SideNav />
    <div class="home">
      <Navbar />
      <div class="navbar-pad" style="height: 40px"></div>
      <router-view />
      <BottomNavbar />
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import BottomNavbar from '@/components/BottomNavbar.vue';
import SideNav from '../components/SideNav.vue';

export default {
  name: 'home',
  components: {
    Navbar,
    BottomNavbar,
    SideNav,
  },
  methods: {
    gotoNext() {
      this.$router.push({ name: 'signup' });
    },
  },
};
</script>

<style lang="scss" scoped>
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

.navbar-pad {
  @media (min-width: 1024px) {
    display: none;
  }
}

.home {
  @media (min-width: 1024px) {
    min-height: 100vh;
    flex: 1;
    overflow-y: auto;
  }
}
</style>
