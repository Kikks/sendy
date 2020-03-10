<template>
    <div>
        <GreyNavbar title="Edit Group Contact"></GreyNavbar>
        <div class="edit-contact">
            <div class="text-center" v-if="isFetchingContact">
                <icon name="loading" spin primary />
            </div>
            <div class="text-center" v-if="errorMessage">
                <span>{{errorMessage}}</span>
            </div>
            <div v-if="!isFetchingContact && !errorMessage && phones.length > 0">
                <p class="text-center">
                    Enter recipient's name, phone number and airtime frequency
                </p>
                <tl-input class="mt-5" placeholder="Name" v-model="groupName"/>
                <div class="row align-items-center mt-4" v-for="(phone, index) in phones" :key="phone.id">
                    <div class="col-1 text-center">
                        <icon
                            name="delete"
                            color="red"
                            @click.native="deleteNumber(index)"
                            v-if="phones.length > 1"
                        />
                    </div>
                    <div class="col-11">
                        <phone-input 
                            v-model="phone.value" 
                            :uniqueName="`group-contact-${phone.id}`"
                            :defaultCountryCode="defaultCode"
                            :onlyCountries="onlyCountryCodes" 
                            customStyle="margin-top: 0.25rem !important"
                        />
                    </div>
                </div>
                <div class="row pt-3 justify-content-end">
                    <div class="col-3">
                        <button class="btn small" :disabled="!phones[phones.length - 1].value"  @click="createNewPhoneNumber()" style="padding: 0 1px 0 1px;">
                            <icon name="plus" />
                        </button>
                    </div>
                </div>
                <tl-input
                    class="mt-5"
                    placeholder="Airtime Amount"
                    type="number"
                    v-model="airtimeAmount"
                />
                <div class="row mt-4 mb-5">
                    <div class="col-6">
                        <date-picker 
                            placeholder="Start Date" 
                            input-class="date-picker"
                            v-model="startDate"
                            calendar-class="calendar-area"
                            format="yyyy-MM-dd"
                        ></date-picker>
                    </div>
                    <div class="col-6">
                        <date-picker 
                            placeholder="End Date" 
                            input-class="date-picker"
                            v-model="endDate"
                            calendar-class="calendar-area right"
                            format="yyyy-MM-dd"
                            :disabled-dates="{to: new Date(startDate)}"
                            :disabled="!startDate && true"
                        ></date-picker>
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
                <button class="btn mt-5" :disabled="canSubmit || isLoading" @click="editContact">
                    <icon name="loading" spin class="mr-1" size="0.9" v-if="isLoading" />Save Changes
                </button>
            </div>
        </div>

    </div>
</template>
<script>
import axios from 'axios';
import moment from 'moment';
import Helpers from '../../utils/Helpers';
import countries_code from "../../country_code.json";

export default {
     data(){
        return{
            groupName: "",
            ticked:"daily",
            airtimeAmount: "",
            phones: [],
            startDate: "",
            endDate: "",
            isLoading: false,
            isFetchingContact: false,
            status: true,
            status_color_options: {
                checked: "#4CD964",
                unchecked: "#FC001F"
            },
            contact: {},
            errorMessage: "",
            countriesCode: countries_code,
            defaultCode: "NG",
        }
    },
    computed: {
         onlyCountryCodes(){
            if(this.phones.length < 2){
                return this.countriesCode;
            }
            return this.countriesCode.filter(cc => cc == this.defaultCode);
        },
        refinedPhoneNumbers() {
            let refinedArray = [];
            this.phones.forEach(phone => {
                refinedArray.push(
                    phone.value.split('-')[0]
                );
            });
            return refinedArray.filter((phone, index) => refinedArray.indexOf(phone) === index);
        },
        canSubmit(){
            if (
                this.groupName.length < 1 ||
                this.airtimeAmount.length < 1 ||
                this.startDate.length < 1 ||
                this.endDate.length < 1 ||
                !this.phones[this.phones.length - 1].value
            ) {
                return true;
            }
            return false;
        }
    },
    mounted(){
        this.getContact();
    },
    methods: {
        getContact(){
            if(this.isFetchingContact) return;
            this.isFetchingContact = true;
            this.errorMessage = "";
            const contactId = this.$route.params.id;
            const url = `${process.env.VUE_APP_SENDY_SVC_URL}/sendy/contact/${contactId}`;

             axios
                .get(url)
                .then(response => {
                    this.isFetchingContact = false;
                    this.setContact(response.data.data);
                })
                .catch(error => {
                    Helpers.errorResponse(error, (response) => {
                        this.isFetchingContact = false;
                        this.errorMessage = response;
                        this.$toasted.show(response);
                    });
                });
        },
        setContact(contact){
            this.groupName = contact.name;
            this.ticked = contact.frequency;
            this.airtimeAmount = contact.airtimeAmount;
            this.startDate = contact.startDate;
            this.endDate = contact.endDate;
            this.status = contact.status === "active" ? true : false;
            contact.phoneNumber.forEach(phone => {
                this.phones.push({ 
                    id: Math.random(),
                    value: phone,
                });
            });
            this.contact = contact;
        },
        editContact(){
            if(this.isLoading) return;
            this.isLoading = true;

            const url = `${process.env.VUE_APP_SENDY_SVC_URL}/sendy/contact/${this.contact.id}`;

            const currencyCode = Helpers.assignCurrencyCode(this.defaultCode);
            
            const data = {
                name: this.groupName,
                phoneNumber: this.refinedPhoneNumbers,
                currencyCode,
                airtimeAmount: Number(this.airtimeAmount),
                startDate: moment(this.startDate).format('YYYY-MM-DD'),
                endDate: moment(this.endDate).format('YYYY-MM-DD'),
                frequency: this.ticked,
                type: "group",
                status: this.status ? "active" : "inactive"
            };

            axios
                .patch(url, data)
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
        changeIcon(data){
            this.ticked = data;
        },
        deleteNumber(index) {
            this.phones.splice(index, 1);
        },
        createNewPhoneNumber() {
            if (!this.phones[this.phones.length - 1].value) {
                return;
            }

            this.defaultCode = this.phones[this.phones.length - 1].value.split('-')[1];
            this.phones.push({
                value: "",
                id: Math.random()
            });
        },
     }
}
</script>
<style lang="scss">
    .edit-contact{
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

        .date-picker {
            width: 100% !important;
            padding: 20px 0 0;
            border: none;
            border-bottom: 1px solid lightgray;  
        }

        .calendar-area {

            &.right {
                right: -1vh !important;
            }
            
            .selected {
                background: #006FFF !important;
                color: white !important;
            }
        }

        .success-state .field.vue-input-ui .lm-text-danger{
            color: green !important;
        }

        .error-state .field.vue-input-ui .lm-text-danger{
            color: red !important;
        }

    }
</style>
