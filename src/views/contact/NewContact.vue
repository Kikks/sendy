<template>
    <div>
        <GreyNavbar title="Add New Contact">
            <button class="p-0" slot="trailing">
                Delete
            </button>
        </GreyNavbar>

        <div class="new-contact">
            <p class="text-center">
                Enter recipient's name, phone number and airtime frequency
            </p>

            <tl-input class="mt-5" placeholder="Name" v-model="name"/>
            <vue-phone-number-input
                valid-color="#006FFF"
                :translations="phoneNumberInputOptions"
                default-country-code="NG"
                v-model="rawPhone"
                size="lg"
                required
                error
                :countries-height="25"
                :only-countries="countriesCode"
                class="mt-5"
                @update="handlePhoneInputUpdate"
            />
            <tl-input class="mt-5" placeholder="Airtime Amount" type="number" v-model="airtime_amount" />
            <div class="row mt-4 mb-5">
                <div class="col-6">
                    <tl-input placeholder="Start Date" type="date" v-model="start_date" />
                </div>
                <div class="col-6">
                    <tl-input placeholder="End Date" type="date" v-model="end_date" />
                </div>
            </div>
            <div class="frequency mb-5">
                <div>Frequency</div>
                <div @click="changeIcon('daily')" class="freq">
                    <div>Daily</div>
                    <icon v-if="ticked =='daily'" name="check"></icon>
                </div>
                <div @click="changeIcon('weekly')" class="freq">
                     <div>Weekly</div>
                    <icon v-if="ticked =='weekly'" name="check"></icon>
                </div>
                <div @click="changeIcon('monthly')" class="freq">
                     <div>Monthly</div>
                    <icon v-if="ticked =='monthly'" name="check"></icon>
                </div>
            </div>
            <div class="row justify-content-space-between">
                <div class="col">Status {{ status ? '(Active)' : '(Inactive)' }}</div>
                <div class="col-6 text-right">
                    <toggle-button
                        v-model="status"
                        :height="30"
                        :width="60"
                        class="ml-2"
                        :color="status_color_options"
                    />
                </div>
            </div>
            <button class="btn mt-5" :disabled="canSubmit || isLoading" @click="addContact">
                <icon name="loading" spin class="mr-1" size="0.9" v-if="isLoading" />Save Changes
            </button>
        </div>

    </div>
</template>
<script>
import axios from 'axios';
import Helpers from '../../utils/Helpers';
import countries_code from "../../country_code.json";

export default {
     data(){
        return{
            ticked:"daily",
            name: "",
            phone: "",
            rawPhone: "",
            airtime_amount: "",
            start_date: "",
            end_date: "",
            isLoading: false,
            status: false,
            status_color_options: {
                checked: "#4CD964",
                unchecked: "#FC001F"
            },
            phoneNumberInputOptions: {
                countrySelectorLabel: "Code",
                countrySelectorError: "Select a valid code",
                phoneNumberLabel: "Phone",
                example: "Invalid e.g : "
            },
            countriesCode: countries_code,
            phoneNumberMetaData: {}

        }
    },
    watch: {
        phone(x){
            console.log(x);
        }
    },
    computed: {
        canSubmit(){
            if(this.name.length < 1 || 
                this.phone.length < 1 || 
                this.airtime_amount.length < 1 || 
                this.start_date.length < 1 || 
                this.end_date.length < 1 || 
                !this.phoneNumberMetaData.isValid
            ) {
                return true;
            }
            return false;
        }
    },
    methods: {
        addContact(){
            if(this.isLoading) return;
            this.isLoading = true;

            const url = `${process.env.VUE_APP_SENDY_SVC_URL}/sendy/contact`;
            const data = {
                name: this.name,
                phoneNumber: this.phone,
                currencyCode: "NGN",
                airtimeAmount: Number(this.airtime_amount),
                startDate: this.start_date,
                endDate: this.end_date,
                frequency: this.ticked,
                type: "individual",
                status: this.status ? "active" : "inactive"
            };
            
            axios
                .post(url, data)
                .then(response => {
                    this.isLoading = false;
                    this.$toasted.show(response.data.message);
                    this.$store.dispatch('getContacts');
                    this.$router.push({name: 'contacts'});
                })
                .catch(error => {
                    Helpers.errorResponse(error, (response) => {
                        this.isLoading = false;
                        this.$toasted.show(response);
                    });
                });
        },
        handlePhoneInputUpdate($event){
            this.phoneNumberMetaData = $event;
            if($event.isValid){
                this.phone = $event.formattedNumber;
            }
        },
        changeIcon(data){
            this.ticked = data;
        },
     }
}
</script>
<style lang="scss" scoped>
    .new-contact{
        margin-top: 55px;
        padding: 20px;
        .freq{
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            padding:10px 0;
            border-bottom:1px solid #E6EDFF;
            color:#030039;
            font-size:16px;
            font-weight:bold;
            height: 54px;
        }
    }
</style>
