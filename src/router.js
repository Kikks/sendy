import Vue from 'vue'
import Router from 'vue-router';
import axios from 'axios';
import store from './store.js';
import Home from './views/Home.vue';
import Onboard from './views/Onboard.vue';
import Auth from './views/Auth.vue';
import FullScreen from './views/FullScreen.vue';
import Signup from './views/auth/Signup.vue';
import Login from './views/auth/Login.vue';

Vue.use(Router);

const router =  new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'onboard',
            component: Onboard
        },
        {
            path: '/auth',
            name: 'auth',
            component: Auth,
            children: [
                {
                    path: 'signup',
                    name: 'signup',
                    component: Signup,
                },
                {
                    path: 'login',
                    name: 'login',
                    component: Login,
                }, 
                {
                    path: 'verify',
                    name: 'verify',
                    component: () => import( /* webpackChunkName: "auth" */ './views/auth/Verify.vue')
                },
                {
                    path: '/verify-email',
                    name: 'verify.email',
                    component: () => import( /* webpackChunkName: "auth" */ './views/auth/EmailVerification.vue')
                },
                {
                    path: 'email-verify-request',
                    name: 'email-verify-request',
                    component: () => import( /* webpackChunkName: "auth" */ './views/auth/EmailVerificationRequest.vue')
                },
                {
                    path: 'password-reset-request',
                    name: 'password-reset-request',
                    component: () => import( /* webpackChunkName: "auth" */ './views/auth/PasswordResetRequest.vue')
                },
                {
                    path: '/reset-password',
                    name: 'password-reset',
                    component: () => import( /* webpackChunkName: "auth" */ './views/auth/PasswordReset.vue')
                },
                {
                    path: 'register-name',
                    name: 'register-name',
                    component: () => import( /* webpackChunkName: "auth" */ './views/auth/RegisterName.vue'),
                    beforeEnter: (to, from, next) => {
                        if (from.name === 'signup') {
                            next();
                            return;
                        }
                        next({
                            name: 'signup'
                        });
                    }
                }, 
            ]
        }, {
            path: '/home',
            component: Home,
            children: [{
                    path: '',
                    name: 'home',
                    component: () => import( /* webpackChunkName: "home" */ './views/home/Activity.vue')
                },
                {
                    path: 'topup',
                    name: 'topup',
                    component: () => import( /* webpackChunkName: "home" */ './views/home/Topup.vue')
                },
                {
                    path: 'directtopup',
                    name: 'directtopup',
                    component: () => import( /* webpackChunkName: "home" */ './views/Topup/DirectTopup.vue')
                },
                {
                    path: 'contacts',
                    name: 'contacts',
                    component: () => import( /* webpackChunkName: "home" */ './views/home/Contacts.vue')
                },
            ],
            beforeEnter: (to, from, next) => {
                isLoggedIn(next);
            }
        },
        {
            path: '/',
            component: FullScreen,
            children: [{
                path: 'contact/new',
                name: 'new-contact',
                component: () => import( /* webpackChunkName: "home" */ './views/contact/NewContact.vue')
            }, {
                path: 'contact/new-group',
                name: 'new-group-contact',
                component: () => import( /* webpackChunkName: "home" */ './views/contact/GroupContact.vue')
            }, 
            {
                path: 'contact/:id/edit',
                name: 'edit.contact',
                component: () => import( /* webpackChunkName: "home" */ './views/contact/EditContact.vue')
            },
            {
                path: 'contact/group/:id/edit',
                name: 'edit.group.contact',
                component: () => import( /* webpackChunkName: "home" */ './views/contact/EditGroupContact.vue')
            },
            {
                path: 'send-airtime',
                name: 'send-airtime',
                component: () => import( /* webpackChunkName: "home" */ './views/airtime/SendAirtime.vue')
            }, {
                path: 'profile',
                name: 'profile',
                component: () => import( /* webpackChunkName: "home" */ './views/settings/Profile.vue')
            }, {
                path: 'security',
                name: 'security',
                component: () => import( /* webpackChunkName: "home" */ './views/settings/Security.vue')
            }, {
                path: 'about',
                name: 'about',
                component: () => import( /* webpackChunkName: "home" */ './views/settings/About.vue')
            }, {
                path: 'addcard',
                name: 'addcard',
                component: () => import( /* webpackChunkName: "home" */ './views/settings/AddCard.vue')
            }],
            beforeEnter(to, from, next){
                isLoggedIn(next);
            }
        },

    ]
})

const isLoggedIn = (next) => {
    if (!store.state.isLoggedIn) {
        const userData = JSON.parse(window.localStorage.getItem("tinylabs-sendy-user"));
        if (userData) {
            axios.defaults.headers.common['Authorization'] = `jwt ${userData.token}`;
            store.commit('setUser', userData);
            next();
            return;
        } else {
            next({
                name: 'onboard'
            });
        }
    }
    next();
};

let __isRetryRequest = false;
axios.interceptors.response.use(response => response, error => {
    if(error && error.response) {
        if(error.response.status === 401 && error.response.data.message === "Token revoked." && !__isRetryRequest) {
            __isRetryRequest = true;
            store
                .dispatch('logout')
                .then(() => {
                    router.push({ name: 'login' });
                });
        }
    }
    return Promise.reject(error);
});

export default router;