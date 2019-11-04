import LoadScript from 'vue-plugin-load-script';
import Vue from 'vue';

Vue.use(LoadScript);

const init = () => {
    Vue.loadScript("https://sdk.accountkit.com/en_EN/sdk.js")
    .then(() => {
        window.AccountKit_OnInteractive = () => {
            window.AccountKit.init({
                appId: `${process.env.VUE_APP_ACCOUNT_KIT_APP_ID}`,
                state: Math.random().toString(),
                version: `${process.env.VUE_APP_ACCOUNT_KIT_APP_VERSION}`,
                fbAppEventsEnabled: true,
                debug: true,
                display: "modal"
            });
        };
    })
    .catch(() => {
      // Failed to fetch script
    });

};

const login = (type, { email, phone }, callback) => {
    const data = {};
    let loginType;

    if(type === "PHONE") {
        const number = phone.substring(4);
        loginType = "PHONE";
        data.countryCode = phone.substring(0, 4);
        data.phoneNumber = number.split("-")[0];

    }

    if(type === "EMAIL"){
        loginType = "EMAIL";
        data.emailAddress = email;
    }

    window.AccountKit.login(loginType, data, callback);
};

export {
    init,
    login
};
