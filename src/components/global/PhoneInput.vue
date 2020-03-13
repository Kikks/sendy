<template>
    <div>
        <vue-phone-number-input
            :valid-color="validColor"
            :translations="phoneNumberInputOptions"
            :default-country-code="defaultCountryCode"
            v-model="rawPhone"
            :style="customStyle"
            :required="required"
            :error="error"
            :countries-height="countriesHeight"
            :only-countries="allowSelectCountries ? onlyCountries : null"
            @update="handlePhoneInputUpdate"
            :class="`${hasError ? 'error-state' : 'success-state'} mt-5`"
            :ref="`phone-input-${uniqueName}`"
            :id="`VuePhoneNumberInput-${uniqueName}`"
        />
    </div>
</template>
<script>
import country_code from '../../country_code.json';
export default {
    props: {
        validColor: {
            type: String,
            default: "006FFF"
        },
        defaultCountryCode: {
            type: String,
            default: "NG"
        },
        size: {
            type: String,
            default: "lg"
        },
        required: {
            type: Boolean,
            default: true
        },
        error: {
            type: Boolean,
            default: true
        },
        countriesHeight: {
            type: Number,
            default: 25
        },
        allowSelectCountries: {
            type: Boolean,
            default: true
        },
        onlyCountries: {
            type: Array,
            default() {
                return country_code
            }
        },
        uniqueName: {
            type: String,
            default: Math.random().toString(),
            required: true
        },
        value: {
            type: String
        },
        customStyle: {
            type: String
        },
        clear: {
            type: Boolean,
            default: false,
        },
    },
    watch: {
        clear(v) {
            if(v) {
                this.rawPhone = "";
            }
        },
    },
    data() {
        return {
            phone: this.value,
            hasError: false,
            rawPhone: this.value,
            phoneNumberInputOptions: {
                countrySelectorLabel: "Code",
                countrySelectorError: "Select a valid code",
                phoneNumberLabel: "Phone",
                example: ""
            }
        }
    },
    methods: {
        handlePhoneInputUpdate($event){
            if(this.$refs[`phone-input-${this.uniqueName}`].isValid) {
                this.hasError = false;
            } else {
                this.hasError = true;
            }
            if($event.isValid){
                this.$emit('input', `${$event.formattedNumber}-${$event.countryCode}`);
            } else {
                this.$emit('input', '');
            }
        }
    }
}
</script>
<style lang="scss">
.vue-phone-number-input {
    .input-country-selector {
        display: flex;
        flex-direction: row;
        border-bottom: 1px solid lightgray;
        
        .field-input {
            border: none !important;
        }
        &.is-focused {
            border: none !important;
            border-bottom: 1px solid lightgray !important;
        }
    }
    .input-phone-number {
       // display: flex;
        //flex-direction: row;
        border-bottom: 1px solid lightgray;

        .field-input {
            border: none !important;   
        }
        &.is-focused {
            border: none !important;
            border-bottom: 1px solid lightgray !important;
        }
    }
    .country-list{
        height: auto !important;
    }

    .success-state .field.vue-input-ui .lm-text-danger{
        color: green !important;
    }

    .error-state .field.vue-input-ui .lm-text-danger{
        color: red !important;
    }
}
</style>