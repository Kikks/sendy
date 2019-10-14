import Vue from 'vue';
import Toasted from 'vue-toasted';
import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';

Vue.use(Toasted,{ position: "bottom-center", duration : 3000 });

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
