<template>
    <div>
        <GreyNavbar title="Add New Contact">
            <button class="p-0" slot="trailing">
                Delete
            </button>
        </GreyNavbar>

        <div class="new-contact">
            <p class="text-center">
                Enter group name, phone numbers and airtime frequency
            </p>

            <tl-input class="mt-5" placeholder="Group Name" v-model="groupName" />

            <div class="row align-center mt-4" v-for="(phone, index) in phones" :key="phone.id">
                <div class="col-1 text-center">
                    <icon name="delete" color="red" @click.native="deleteNumber(index)" v-if="phones.length > 1" />
                </div>
                <div class="col-10">
                    <vue-phone-number-input 
                        valid-color="#006FFF" 
                        :translations="phoneNumberInputOptions" 
                        default-country-code="NG" 
                        v-model="phone.value" 
                        size="lg" 
                        required 
                        error 
                        :countries-height="25"
                        :only-countries="countriesCode"
                        @update="handlePhoneInputUpdate"
                        :no-use-browser-locale="true"
                    />
                    <!-- <vue-phone-number-input v-model="phone.value"/> -->
                    <!-- <tl-input class="new-contact-phone-input" :placeholder="`Phone Number ${index + 1}`" type="tel" v-model="phone.value" /> -->
                </div>
                <div class="col-1 text-center" v-if="index == 0">
                    <icon name="plus" color="green" @click.native="createNewPhoneNumber()" />
                </div>
            </div>

            <tl-input class="mt-5" placeholder="Airtime Amount" type="number" v-model="airtimeAmount" />

            <div class="row mt-4 mb-5">
                <div class="col-6">
                    <tl-input placeholder="Start Date" type="date" />
                </div>
                <div class="col-6">
                    <tl-input placeholder="End Date" type="date" />
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
                <div class="col">
                    Status {{ status ? '(Active)' : '(Inactive)' }}
                </div>
                <div class="col-6 text-right">
                    <toggle-button v-model="status" :height="30" :width="60" class="ml-2" :color="status_color_options"/>
                </div>
            </div>

            <button class="btn mt-5" @click="addGroupContact">Save Changes</button>
        </div>

    </div>
</template>
<script>
import countries_code from '../../country_code.json';
export default {
     data(){
        return {
            groupName: '',
            ticked:'daily',
            phones: [
                {id: 1, value: ""}
            ],
            airtimeAmount: "",
            startDate: "",
            endDate: "",
            status: true,
            status_color_options: {
                checked: '#4CD964', 
                unchecked: '#FC001F'
            },
            phoneNumberInputOptions: {
                countrySelectorLabel: 'Code',
                countrySelectorError: 'Select a valid code',
                phoneNumberLabel: 'Phone',
                example: 'Invalid e.g : '
            },
            countriesCode: countries_code,
            formattedPhoneNumberInfo: {},
            formattedPhones: []
        }
    },
    computed: {
        filterPhoneNumbers(){
            return this.formattedPhones
                        .filter((phone => phone === phone));
        }
    },
    methods: {
        changeIcon(data){
            this.ticked = data;
        },
        createNewPhoneNumber(){
            if(!this.phones[this.phones.length-1].value){
                return;
            }

            if(!this.formattedPhoneNumberInfo.isValid) {
                return;
            }
            this.formattedPhones.push(this.formattedPhoneNumberInfo.formattedNumber);
            this.phones.push({
                value: "",
                id: Math.random()
            });

            console.log(this.formattedPhones);
        },
        addGroupContact(){
            const url = ``;

            const data = {
                name: this.groupName,
                phoneNumber: this.filterPhoneNumbers,
                currencyCode: "NGN",
                airtimeAmount: Number(this.airtimeAmount),
                startDate: this.startDate,
                endDate: this.endDate,
                frequency: this.ticked,
                type: "group",
                status: this.status
            };

            console.log(data);
        },
        deleteNumber(index){
            this.phones.splice(index,1);
        },
        handlePhoneInputUpdate($event){
            this.formattedPhoneNumberInfo = $event;
        }
     }
}
</script>

<style lang="scss">
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
        .new-contact-phone-input {
            &:nth-child(1) {
                margin-top: 0px !important;
                //background: red;
            }
        }
        .add-phone-number-icon{
            cursor: pointer;
        }
    }
</style>
