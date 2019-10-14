import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import Helpers from './utils/Helpers.js';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        isRegistered: false,
        user: {}
    },
    getters: {
        getIsRegistered(state) {
            return state.isRegistered;
        },
        getUser(state){
            return state.user;
        }
    },
    mutations: {
        setIsRegistered(state, payload) {
            state.isRegistered = payload;
        },
        setUser(state, payload){
            state.user = payload;
        }
    },
    actions: {
        login({ commit }, { phoneNumber, password }){
            return new Promise((resolve, reject) => {
                const url = `${process.env.VUE_APP_GEN_AUTH_SVC_URL}/auth/login`;
                
                axios
                    .post(url, {
                        phoneNumber,
                        password,
                        app: `${process.env.VUE_APP_APP_ID}`,
                        email: 'danieel@gmail.com'
                    })
                    .then(response => {
                        const user = response.data.data.user;
                        const token = response.data.data.token;

                        const userData = {
                            ...user, 
                            token
                        };

                        commit('setUser', userData);
                        window.localStorage.setItem("tinylabs-sendy-user", JSON.stringify(userData));
                        axios.defaults.headers.common['Authorization'] = `jwt ${token}`;
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    })

            });
        },
        checkIsRegistered({ commit }, data) {
            return new Promise((resolve, reject) => {
                const url = `${process.env.VUE_APP_GEN_AUTH_SVC_URL}/auth/check`;
                axios
                    .post(url, data)
                    .then(response => {
                        const isNotRegistered = response.data.data;
                        
                        if(!isNotRegistered){
                            commit('setIsRegistered', !isNotRegistered);
                        } else {
                            commit('setIsRegistered', !isNotRegistered)
                        }
                        resolve(response);
                    })
                    .catch(error => {
                        Helpers.errorResponse(error, (response) => {
                            console.log(response);
                            reject(error);
                        })
                    });
            });
        }
    }
});