import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue';
import Onboard from './views/Onboard.vue';
import Auth from './views/Auth.vue';
import FullScreen from './views/FullScreen.vue';

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
            path: '/',
            name: 'onboard',
            component: Onboard
        },
        {
            path: '/auth',
            name: 'auth',
            component: Auth,
            children: [{
                path: 'signup',
                name: 'signup',
                component: () => import( /* webpackChunkName: "auth" */ './views/auth/Signup.vue')
            }, {
                path: 'verify',
                name: 'verify',
                component: () => import( /* webpackChunkName: "auth" */ './views/auth/Verify.vue')
            }, {
                path: 'register-name',
                name: 'register-name',
                component: () => import( /* webpackChunkName: "auth" */ './views/auth/RegisterName.vue')
            }, ]
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
                    path: 'contacts',
                    name: 'contacts',
                    component: () => import( /* webpackChunkName: "home" */ './views/home/Contacts.vue')
                },
            ]
        },
        {
            path: '/',
            component: FullScreen,
            children: [{
                path: 'contact/new',
                name: 'new-contact',
                component: () => import( /* webpackChunkName: "home" */ './views/contact/NewContact.vue')
            }, {
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
            }, ]
        },

    ]
})