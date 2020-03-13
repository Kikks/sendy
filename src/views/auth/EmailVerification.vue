<template>
	<div class="verify px-4">
        <div class="verify-top" v-if="false">
            <div class="row align-items-center">
                <div class="col-2">
                    <div>
                        <icon name="cellphone"></icon>
                    </div>
                </div>
                <div class="col-10">
                    Please type the verification code sent to <span style="font-weight:bold">+234808***1500</span>
                </div>
            </div>
        </div>
        <div class="card-holder elevate">
            <div class="mb-4">
                <h1>Verifying Email</h1>
            </div>

            <icon name="loading" spin primary size="2" v-if="isVerifying" />

            <div class="row align-items-center" v-if="false">
                <div class="col-6 text-left">
                    <button @click="goBack()">Resend</button>
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

import axios from 'axios';
import Helpers from '../../utils/Helpers';

export default {
  name: 'verify.email',
  data(){
      return {
          isVerifying: false
      };
  },
  mounted() {
      this.verify();
  },
  methods: {
      verify(){
          this.isVerifying = true;
          const token = this.$route.query.token;
          const url = `${process.env.VUE_APP_GEN_AUTH_SVC_URL}/auth/verify-email`;

          if(token) {
              axios
                .patch(url, {token})
                .then(response => {
                    const { user } = response.data.data;
                    if(user.emailVerified) {

                        const user = response.data.data.user;
                        const token = response.data.data.token;

                        const userObj = {
                            ...user,
                            token,
                        };
                        this.setUser(userObj, token);
                        this.$router.push({ name: 'home' });
                    }
                    this.isVerifying = false;
                })
                .catch(error => {
                    Helpers.errorResponse(error, response => {
                        this.$toasted.show(response);
                        this.isVerifying = false;
                    })
                });
          }

      },
      setUser(userData, token){
        this.$store.commit('setUser', userData);
        window.localStorage.setItem("tinylabs-sendy-user", JSON.stringify(userData));
        axios.defaults.headers.common['Authorization'] = `jwt ${token}`;
      },
      goBack(){
          this.$router.push({name:"signup"});
      },
      gotoNext(){
          this.$router.push({name:"register-name"});
      }
  }
}
</script>

<style lang="scss" scoped>
.verify{
    .card-holder{
        border-radius: 10px;
        background-color: white;
        padding: 50px 30px;
        margin-top: 50px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-top: 250px;
        height: 20vh;
    }
    .verify-top{
        margin-top: 100px;
        color:white;
    }
}
</style>