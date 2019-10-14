<template>
    <div class="registername px-4">
        <div class="card-holder elevate">
            <div class="mb-4">
                <h1>Personalize your experience</h1>
            </div>

            <tl-input class="mb-4" placeholder="First Name" v-model="firstName" />
            <tl-input class="mb-4" placeholder="Last Name" v-model="lastName" />
            <tl-input type="email" class="mb-4" placeholder="Email" v-model="email" />

            <div class="row align-items-center mt-5">
                <div class="col-6 text-left">
                    <button @click="gotoNext()">Skip</button>
                </div>
                <div class="col-6 text-right">
                    <button class="round-btn" @click="gotoNext()">
                        <icon name="arrow-right" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import Helpers from "../../utils/Helpers.js";

export default {
    name: "registername",
    data() {
        return {
            firstName: "",
            lastName: "",
            email: ""
        };
    },
    computed: {
        isDisabled() {
            if (
                this.firstName.length < 1 ||
                this.lastName.length < 1 ||
                !Helpers.isValidEmail(this.email)
            ) {
                return true;
            }
            return false;
            //git clone https://geekdanitek:Bobosoftboy123@github.com/RaymondAtivie/tinylabs-sendy.git
        }
    },
    methods: {
        gotoNext() {
            if (!this.isDisabled) {
                this.$router.push({ name: "home" });
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.registername {
    .card-holder {
        border-radius: 10px;
        background-color: white;
        padding: 50px 30px;
        margin-top: 20vh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
}
</style>