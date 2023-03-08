import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isRegistered: false,
    isLoggedIn: false,
    user: {},
    userInfo: {},
    currentPhoneNumber: '',
    contacts: [],
    activities: [],
    transactions: [],
    cards: [],
    paginationMetaData: {},
    countries: null,
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
    getActivities(state) {
      return state.activities;
    },
    getTransactions(state) {
      return state.transactions;
    },
    getCards(state) {
      return state.cards;
    },
    getPaginationMetaData(state) {
      return state.paginationMetaData;
    },
    getCountries(state) {
      return state.countries;
    },
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
    setContacts(state, payload) {
      state.contacts = payload;
    },
    setUserInfo(state, payload) {
      state.userInfo = payload;
    },
    setActivities(state, payload) {
      state.activities = payload;
    },
    setTransactions(state, payload) {
      state.transactions = payload;
    },
    logout(state) {
      state.user = {};
      state.isLoggedIn = false;
    },
    setCards(state, payload) {
      state.cards = payload;
    },
    setPaginationMetaData(state, payload) {
      state.paginationMetaData = payload;
    },
    setCountries(state, payload) {
      state.countries = payload;
    },
  },
  actions: {
    login({ commit }, { email, password }) {
      return new Promise((resolve, reject) => {
        const url = `${process.env.VUE_APP_GEN_AUTH_SVC_URL}/auth/login`;

        axios
          .post(url, {
            email,
            password,
          })
          .then((response) => {
            const { user } = response.data.data;
            const { token } = response.data.data;

            const userData = {
              ...user,
              token,
            };

            commit('setUser', userData);
            window.localStorage.setItem(
              'tinylabs-sendy-user',
              JSON.stringify(userData)
            );
            axios.defaults.headers.common.Authorization = `Bearer ${token}`;
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    logout({ commit }) {
      return new Promise((resolve, reject) => {
        try {
          const url = `${process.env.VUE_APP_GEN_AUTH_SVC_URL}/auth/logout`;
          axios.get(url);

          localStorage.removeItem('tinylabs-sendy-user');
          delete axios.defaults.headers.common.Authorization;
          commit('logout');
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    checkIsRegistered({ commit }, data) {
      return new Promise((resolve, reject) => {
        const url = `${process.env.VUE_APP_GEN_AUTH_SVC_URL}/auth/check`;
        axios
          .post(url, data)
          .then((response) => {
            commit('setIsRegistered', !response.data.data);
            resolve(response);
          })
          .catch((error) => {
            if (error && error.response && error.response.data) {
              commit('setIsRegistered', !error.response.data.data);
            }
            reject(error);
          });
      });
    },
    getContacts({ commit }, { type, page }) {
      return new Promise((resolve, reject) => {
        const url = `${process.env.VUE_APP_SENDY_SVC_URL}/contacts?page=${page}${type}`;
        axios
          .get(url)
          .then((response) => {
            commit('setContacts', response.data.data.contacts);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    getUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        const url = `${process.env.VUE_APP_SENDY_SVC_URL}/user`;
        axios
          .get(url)
          .then((response) => {
            commit('setUserInfo', response.data.data.user);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    getActivities({ commit }, page = 1) {
      return new Promise((resolve, reject) => {
        const url = `${process.env.VUE_APP_SENDY_SVC_URL}/transactions?page=${page}`;
        axios
          .get(url)
          .then((response) => {
            commit('setActivities', response.data.data.transactions);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    getTransactions({ commit }, { transactionId, page = 1 }) {
      return new Promise((resolve, reject) => {
        const url = `${process.env.VUE_APP_SENDY_SVC_URL}/sendy/transaction/airtime/${transactionId}?page=${page}`;
        axios
          .get(url)
          .then((response) => {
            commit('setTransactions', response.data.data);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    updateUser({ commit }, { data }) {
      return new Promise((resolve, reject) => {
        const url = `${process.env.VUE_APP_GEN_AUTH_SVC_URL}/user`;
        axios
          .patch(url, data)
          .then((response) => {
            const userData = JSON.parse(
              window.localStorage.getItem('tinylabs-sendy-user')
            );

            const { first_name, last_name } = response.data.data.user;

            const updatedUserData = {
              ...userData,
              first_name,
              last_name,
            };

            commit('setUser', updatedUserData);
            window.localStorage.setItem(
              'tinylabs-sendy-user',
              JSON.stringify(updatedUserData)
            );

            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    updateUserPassword(_, { data }) {
      return new Promise((resolve, reject) => {
        const url = `${process.env.VUE_APP_GEN_AUTH_SVC_URL}/user/change-password`;
        axios
          .patch(url, data)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    getCards({ commit }) {
      return new Promise((resolve, reject) => {
        const url = `${process.env.VUE_APP_SENDY_SVC_URL}/cards`;
        axios
          .get(url)
          .then((response) => {
            commit('setCards', response.data.data.cards);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    getCountries({ commit }) {
      return new Promise((resolve, reject) => {
        const url = `${process.env.VUE_APP_SENDY_SVC_URL}/util/countries`;
        axios
          .get(url)
          .then((response) => {
            commit('setCountries', response.data.data.countries || []);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
});
