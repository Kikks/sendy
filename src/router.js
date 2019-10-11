import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue';
import Onboard from './views/Onboard.vue';
import Auth from './views/Auth.vue';

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
        },
        {
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
            // {
            //     path: 'register-name',
            //     name: 'register-name',
            //     component: () => import( /* webpackChunkName: "home" */ './views/home/RegisterName.vue')
            // }, 
        ]
        },

    ]
})