import Vue from 'vue';
import Toasted from 'vue-toasted';
import ToggleButton from 'vue-js-toggle-button';
import DatePicker from 'vuejs-datepicker';
import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';

Vue.component('vue-phone-number-input', VuePhoneNumberInput);
Vue.component('date-picker', DatePicker);
Vue.use(Toasted,{ position: "bottom-center", duration : 3000 });
Vue.use(ToggleButton);

const requireComponent = require.context(
    './components/global',
    true,
    /\.(js|vue)$/i
)
requireComponent.keys().forEach(fileName => {
    const componentConfig = requireComponent(fileName)
    const componentName = upperFirst(
        camelCase(
            fileName
            .split('/')
            .pop()
            .replace(/\.\w+$/, '')
        )
    )
    Vue.component(
        componentName,
        componentConfig.default || componentConfig
    )
});
