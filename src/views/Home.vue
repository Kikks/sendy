<template>
	<div class="home">
        <Navbar />
        <div style="height: 40px;"></div>
        <router-view />
        <BottomNavbar />
	</div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import BottomNavbar from "@/components/BottomNavbar.vue";

export default {
  name: 'home',
  components: {
      Navbar,
      BottomNavbar,
  },
  methods: {
      gotoNext(){
          this.$router.push({name: 'signup'});
      }
  }
}
</script>