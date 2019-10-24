import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import Helpers from './utils/Helpers.js';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        isRegistered: false,
        isLoggedIn: false,
        user: {},
        userInfo: {},
        currentPhoneNumber: "",
        contacts: [],
        activities: []
    },
    getters: {
        getIsRegistered(state) {
            return state.isRegistered;
        },
        getUser(state) {
            return state.user;
        },
        getCurrentPhoneNumber(state) {
            return state.currentPhoneNumber;
        },
        getContacts(state) {
            return state.contacts;
        },
        getUserInfo(state) {
            return state.userInfo;
        },
        getActivities(state){
            return state.activities;
        }

    },
    mutations: {
        setIsRegistered(state, payload) {
            state.isRegistered = payload;
        },
        setUser(state, payload) {
            state.user = payload;
            state.isLoggedIn = true;
        },
        setCurrentPhoneNumber(state, payload) {
            state.currentPhoneNumber = payload;
        },
        setContacts(state, payload){
            state.contacts = payload;
        },
        setUserInfo(state, payload) {
            state.userInfo = payload;
        },
        setActivities(state, payload) {
            state.activities = payload
        },
    },
    actions: {
        login({
            commit
        }, {
            username,
            password,
            type
        }) {
            return new Promise((resolve, reject) => {
                const url = `${process.env.VUE_APP_GEN_AUTH_SVC_URL}/auth/login`;

                axios
                    .post(url, {
                        username,
                        password,
                        type,
                        app: `${process.env.VUE_APP_APP_ID}`,
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
                    });

            });
        },
        checkIsRegistered({
            commit
        }, data) {
            return new Promise((resolve, reject) => {
                const url = `${process.env.VUE_APP_GEN_AUTH_SVC_URL}/auth/check`;
                axios
                    .post(url, data)
                    .then(response => {

                        commit('setIsRegistered', !response.data.data); 
                        resolve(response);
                    })
                    .catch(error => {
                        if(error && error.response && error.response.data) {
                            commit('setIsRegistered', !error.response.data.data);
                        }
                        reject(error);
                    });
            });
        },
        getContacts({ commit }){
            return new Promise((resolve, reject) => {

                const url = `${process.env.VUE_APP_SENDY_SVC_URL}/sendy/contact`;
                axios
                .get(url)
                .then(response => {
                    commit('setContacts', response.data.data);
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
            });
        },
        getUserInfo({ commit }) {
            return new Promise((resolve, reject) => {

                const url = `${process.env.VUE_APP_SENDY_SVC_URL}/sendy/user`;
                axios
                .get(url)
                .then(response => {
                    commit('setUserInfo',  response.data.data);
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
            });
        },
        getActivities({ commit }){
            return new Promise((resolve, reject) => {
                const url = `${process.env.VUE_APP_SENDY_SVC_URL}/sendy/transaction`;
                axios
                    .get(url)
                    .then(response => {
                        commit('setActivities', response.data.data);
                        resolve(response);
                    })
                    .catch(error => {
                      reject(error);
                    });
                });
        },
        updateUser({ commit }, { data, type }){
            return new Promise((resolve, reject) => {
                const url = `${process.env.VUE_APP_GEN_AUTH_SVC_URL}/auth/user`;
                axios
                    .patch(url, data)
                    .then(response => {
                        if(type === 'update_info'){
                            const userData = JSON.parse(window.localStorage.getItem("tinylabs-sendy-user"));
                            const updatedUserData = {
                                ...userData,
                                firstName: data.firstName && data.firstName,
                                lastName: data.lastName && data.lastName,
                                phoneNumber: data.phoneNumber && data.phoneNumber,
                                email: data.email && data.email
                            };
                            commit('setUser', updatedUserData);
                            window.localStorage.setItem("tinylabs-sendy-user", JSON.stringify(updatedUserData));
                        }

                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
                });
        }
    }
});