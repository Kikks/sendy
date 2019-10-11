<template>
	<div class="fullscreen">
        <GreyNavbar />

        <router-view />
	</div>
</template>

<script>
import GreyNavbar from "@/components/GreyNavbar.vue";

export default {
    name: 'fullscreen',
    components: {
        GreyNavbar,
    },
}
</script>