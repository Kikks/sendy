import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        isRegistered: false
    },
    getters: {
        getIsRegistered(state) {
            return state.isRegistered;
        }
    },
    mutations: {
        setIsRegistered(state, payload) {

        }
    },
    actions: {
        checkIsRegistered(context) {
            const url = `${process.env.VUE_APP_GEN_AUTH_SVC_URL}/auth/check`;
            console.log(url);
        }
    }
})